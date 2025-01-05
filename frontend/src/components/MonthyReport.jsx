import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../store/order";
import { fetchCategories } from "../store/categories";
import * as XLSX from "xlsx"; // Import xlsx library

const MonthlyReport = () => {
  const dispatch = useDispatch();
  const [groupedData, setGroupedData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [doctors, setDoctors] = useState([]); // Store doctors list
  const [searchQuery, setSearchQuery] = useState(""); // For search functionality

  const { allOrders } = useSelector((state) => state.order);

  useEffect(() => {
    // Fetch orders and categories
    dispatch(fetchAllOrders());
    dispatch(fetchCategories()).then((res) => setCategories(res.payload));

    // Fetch doctors in a single request
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

  useEffect(() => {
    if (allOrders.length) {
      const groupOrdersByDoctor = () => {
        // Filter out invalid orders
        const validOrders = allOrders.filter(
          (order) =>
            order.referredBy && order.referredBy !== "0" && order.referredBy !== "none"
        );

        // Filter orders based on search query
        const filteredOrders = validOrders.filter((order) => {
          const doctor = doctors.find((doctor) => doctor._id === order.referredBy);
          return (
            order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (doctor && doctor.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            order.serialNo.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });

        const grouped = filteredOrders.reduce((acc, order) => {
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
  }, [allOrders, doctors, searchQuery]);

  // Function to handle Excel download
  const downloadExcel = () => {
    const excelData = [];
    let serialNo = 1; // Start serial number from 1

    groupedData.forEach((group) => {
      const doctor = group.doctor;
      const totalCommission = group.orders.reduce(
        (total, order) => total + (order.referralFee - order.discount),
        0
      );

      // Add a row for the doctor
      excelData.push({
        "Serial No": serialNo++,
        "Doctor Name": doctor.name || "Unknown",
        "Total Commission": totalCommission,
      });
    });

    // Create a new worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    // Create a new workbook and add the worksheet to it
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Doctor Report");

    // Download the workbook as an Excel file
    XLSX.writeFile(wb, "Doctor_Report.xlsx");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-cyan-500 mb-4">Monthly Report</h1>

      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Serial No</th>
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
                className={`${
                  orderIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                <td className="border border-gray-300 p-2">{order.serialNo}</td>
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
                    {order.subcategory === category.name ? category.name : ""}
                  </td>
                ))}
                <td className="border border-gray-300 p-2">
                  {order.discount || 0}
                </td>
                <td className="border border-gray-300 p-2">
                  {order.finalPayment || 0}
                </td>
                <td className="border border-gray-300 p-2">{order.referralFee}</td>
                <td className="border border-gray-300 p-2">
                  {order.referralFee - order.discount}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button
        onClick={downloadExcel}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Download Excel
      </button>
    </div>
  );
};

export default MonthlyReport;