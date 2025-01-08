import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, fetchOrdersByDate } from "../store/order"; // import fetchOrdersByDate
import { fetchCategories } from "../store/categories";
import { DateRange } from "react-date-range"; // Import date-range picker
import * as XLSX from "xlsx"; // Import xlsx library
import "react-date-range/dist/styles.css"; // Import default styles
import "react-date-range/dist/theme/default.css"; // Import theme styles
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const MonthlyReport = () => {
  const dispatch = useDispatch();
  const [groupedData, setGroupedData] = useState([]);
  const [records, setRecords] = useState([]);  // Store records
const [message, setMessage] = useState("");   // Store message

  const [categories, setCategories] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryDoc, setSearchQueryDoc] = useState("");
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const { allOrders } = useSelector((state) => state.order);

  // Fetch all orders and categories when the component mounts
  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchCategories()).then((res) => setCategories(res.payload));

    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/doctors");
        const data = await response.json();
        setDoctors(data.doctors || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [dispatch]);

  // Initially set the filtered orders to all orders
  useEffect(() => {
    setFilteredOrders(allOrders);
  }, [allOrders]);

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQueryDoc.toLowerCase())
  );

  // Apply date range filter and dispatch action to fetch orders within that range
  const applyDateFilter = () => {
    const { startDate, endDate } = dateRange[0];
    console.log(selectedDoctor);
  
    // Ensure the date range is treated as full days by setting hours to 00:00:00
    const normalizedStartDate = new Date(startDate).setHours(0, 0, 0, 0);
    const normalizedEndDate = new Date(endDate).setHours(23, 59, 59, 999); // end of the day
  
    // Filter orders based on createdAt date and selectedDoctor (if any)
    const filteredByDateAndDoctor = allOrders.filter((order) => {
      const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0); // Normalize to full day
      const isDateInRange = orderDate >= normalizedStartDate && orderDate <= normalizedEndDate;
      const isDoctorMatched = selectedDoctor ? order.referredBy === selectedDoctor : true; // Filter by doctor if selectedDoctor exists
  
      return isDateInRange && isDoctorMatched; // Return only orders that match both criteria
    });
  
    // Update filtered orders
    setFilteredOrders(filteredByDateAndDoctor);
  
    // If no records found after filtering, show the "No records found" message
    if (filteredByDateAndDoctor.length === 0) {
      setMessage("No records found for this date range and doctor.");
    } else {
      setMessage(""); // Clear any previous message
    }
  
    setShowDatePicker(!showDatePicker); // Close the date picker
  };
  
  
  // Handle single date change (e.g., when selecting a specific date)
  const handleDateChange = (selectedDate) => {
    // Clear previous data
    setFilteredOrders([]); // Reset the records
    setMessage("");  // Clear any previous message
  
    // Convert selectedDate to a date object and normalize
    const normalizedSelectedDate = new Date(selectedDate).setHours(0, 0, 0, 0);
  
    // Filter orders for the selected date
    const dataForSelectedDate = groupedData.filter(order => {
      const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0);
      return orderDate === normalizedSelectedDate;
    });
  
    if (dataForSelectedDate.length > 0) {
      setFilteredOrders(dataForSelectedDate);  // Update records with the filtered data
    } else {
      setMessage("No records found for this date.");
    }
  };
  



  // Reset the date filter and show all orders again
  const resetDateFilter = () => {
    setFilteredOrders(allOrders);
    setDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setMessage("")
    setShowDatePicker(!showDatePicker);
  };

  // Update the groupedData whenever filteredOrders change or the date range is applied
  useEffect(() => {
    if (filteredOrders.length) {
      const groupOrdersByDoctor = () => {
        const filteredOrdersData = filteredOrders.filter((order) => {
          const doctor = doctors.find((doctor) => doctor._id === order.referredBy);
          return (
            (order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (doctor &&
                (doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  doctor.phoneNo.toString().includes(searchQuery))) || // Convert phoneNo to a string
              order.serialNo.toLowerCase().includes(searchQuery.toLowerCase())) &&
            order.referredBy !== 0 && // Exclude orders with referredBy set to 0
            order.referredBy !== null // Exclude orders with referredBy as null or none
          );


        });

        const grouped = filteredOrdersData.reduce((acc, order) => {
          const doctorId = order.referredBy;
          if (!acc[doctorId]) acc[doctorId] = [];
          acc[doctorId].push(order);
          return acc;
        }, {});

        const validGroupedData = Object.keys(grouped).map((id) => ({
          doctor: doctors.find((doc) => doc._id === id) || {},
          orders: grouped[id],
        }));

        setGroupedData(validGroupedData);
      };

      groupOrdersByDoctor();
    }
  }, [filteredOrders, doctors, searchQuery]); // Re-run this effect when filteredOrders changes

  // Download the grouped data as an Excel file
  const downloadExcel = () => {
    const excelData = [];
    let serialNo = 1;

    // Use filtered orders for Excel download
    groupedData.forEach((group) => {
      const doctor = group.doctor;
      const totalCommission = group.orders.reduce(
        (total, order) => total + (order.referralFee - order.discount),
        0
      );

      excelData.push({
        "Serial No": serialNo++,
        "Doctor Name": doctor.name || "Unknown",
        "Total Commission": totalCommission,
      });
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Doctor Report");

    XLSX.writeFile(wb, "Doctor_Report.xlsx");
  };

  // Download detailed Excel with all orders
  const downloadDetailedExcel = () => {
    const excelData = [];
    let serialNo = 1;
  
    // Loop through all grouped orders
    groupedData.forEach((group) => {
      const doctor = group.doctor; // Access doctor details
      const orders = group.orders; // Get orders for the doctor
  
      // Loop through the orders for the current doctor
      orders.forEach((order) => {
        const totalCommission = order.referralFee - order.discount;
  
        excelData.push({
          "Serial No": serialNo++, // Increment serial number for each order
          "Doctor Name": doctor.name || "Unknown", // Use doctor name, default to "Unknown"
          "Doctor Mobile": doctor.phoneNo || "N/A", // Use doctor phone, default to "N/A"
          "Doctor Address": doctor.address || "N/A", // Use doctor address, default to "N/A"
          ...categories.reduce((acc, category) => {
            // Assign the correct subcategory based on the category name
            acc[category.name] = order.category === category.name ? order.subcategory || "N/A" : "";
            return acc;
          }, {}),
          Discount: order.discount || 0, // Default to 0 if discount is not available
          "Final Payment": order.finalPayment || 0, // Default to 0 if finalPayment is not available
          "Referral Fee": order.referralFee || 0, // Default to 0 if referralFee is not available
          "Total Commission": totalCommission, // Calculate total commission
        });
      });
    });
  
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Detailed Report");
  
    XLSX.writeFile(wb, "Detailed_Report.xlsx");
  };
  




  return (
    <div className="p-6 mt-16">
      <div className="mb-4 flex items-center space-x-4">
      <div className="flex flex-col w-72 space-y-1.5">
  <Label htmlFor="doctor" className="text-lg font-semibold text-gray-700">
    Select Doctor
  </Label>
  <Select
    onValueChange={setSelectedDoctor}
    className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <SelectTrigger id="doctor">
      <SelectValue placeholder="Select a doctor" />
    </SelectTrigger>
    <SelectContent className="bg-white border border-gray-300 shadow-md rounded-lg max-h-60">
      <div className="sticky top-0 bg-white p-2 border-b border-gray-300">
        <Input
          type="text"
          placeholder="Search doctor"
          value={searchQueryDoc}
          onChange={(e) => setSearchQueryDoc(e.target.value)}
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="max-h-48 overflow-auto">
        <SelectItem value="0">All</SelectItem>
        {filteredDoctors.map((doctor) => (
          <SelectItem key={doctor._id} value={doctor._id}>
            {doctor.name}
          </SelectItem>
        ))}
      </div>
    </SelectContent>
  </Select>
</div>


        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          {showDatePicker ? "Hide Date Picker" : "Show Date Picker"}
        </button>

        {showDatePicker && (
          <div className="ml-4 bg-white border border-gray-300 shadow-md rounded-lg p-4">
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              className="text-sm"
            />
            <div className="mt-4 flex space-x-2">
              <button
                onClick={applyDateFilter}
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition"
              >
                Apply Date Filter
              </button>
              <button
                onClick={resetDateFilter}
                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition"
              >
                Remove Date Filter
              </button>
            </div>
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-3 border border-gray-300 rounded-lg w-full max-w-xs"
      />

      <div className="mb-4 flex justify-end">
        <button
          onClick={downloadExcel}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          Download Report
        </button>

        {/* New button for downloading detailed Excel */}
        <button
          onClick={downloadDetailedExcel}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          Download Detailed Report
        </button>
      </div>

    {message && <p>{message}</p>}
      <table className="w-full border-collapse border border-gray-300 shadow-md">
        {/* Display message if no records found */}
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Serial No</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Doctor Name</th>
            <th className="border border-gray-300 p-2">Doctor Mobile</th>
            <th className="border border-gray-300 p-2">Doctor Address</th>
            {categories.map((category) => (
              <th key={category._id} className="border border-gray-300 p-2">
                {category.name}
              </th>
            ))}
            <th className="border border-gray-300 p-2">Discount</th>
            <th className="border border-gray-300 p-2">Final Payment</th>
            <th className="border border-gray-300 p-2">Referral Fee</th>
            <th className="border border-gray-300 p-2">Total Commission</th>
          </tr>
        </thead>
        <tbody>
          {groupedData.map((group, index) =>
            group.orders.map((order, orderIndex) => (
              <tr
                key={order._id}
                className={`${orderIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
              >
                <td className="border border-gray-300 p-2">{order.serialNo}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td className="border border-gray-300 p-2">
                  {group.doctor.name || "Unknown"}
                </td>
                <td className="border border-gray-300 p-2">
                  {group.doctor.phoneNo || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {group.doctor.address || "N/A"}
                </td>
                {categories.map((category) => (
                  <td key={category._id} className="border border-gray-300 p-2">
                    {order.category === category.name
                      ? order.subcategory || "N/A"
                      : ""}
                  </td>
                ))}
                <td className="border border-gray-300 p-2">
                  {order.discount || 0}
                </td>
                <td className="border border-gray-300 p-2">
                  {order.finalPayment || 0}
                </td>
                <td className="border border-gray-300 p-2">
                  {order.referralFee}
                </td>
                <td className="border border-gray-300 p-2">
                  {order.referralFee - order.discount}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyReport;
