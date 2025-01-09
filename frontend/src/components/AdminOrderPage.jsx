import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Modal from "./model";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { fetchAllOrders, updateOrder } from "../store/order";
import { useDispatch, useSelector } from "react-redux";
import ModalEditForm from "./ModalEditForm";
import axios from "axios";
import { DateRangePicker } from "react-date-range";
import { enGB } from "date-fns/locale";

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [showDateRange, setShowDateRange] = useState(false); // New s
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editOrderData, setEditOrderData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const { allOrders, loading: ordersLoading } = useSelector((state) => state.order);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false); // New state to track filter application
  const [selectAll, setSelectAll] = useState(false);

  // Handle select/deselect all functionality


  const resetDateFilter = () => {
    setSelectedDateRange({
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    });
    setFilterApplied(false); // Reset the filter application state
    setShowDateRange(!showDateRange);
  };
  

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/doctors");
        const data = await response.json();
        setDoctors(data.doctors || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    dispatch(fetchAllOrders());
    fetchDoctors();
  }, [dispatch]);

  const handleToggleDateRange = () => {
    setShowDateRange((prevState) => !prevState); // Toggle DateRange visibility
  };

  useEffect(() => {
    console.log("Updated editOrderData", editOrderData); // This will log the updated data when it's changed
  }, [editOrderData]); // Track when editOrderData changes

  const handleEditSubmit = async (formData) => {
    try {
      const orderId = editOrderData._id; // Get the current order ID
      const updatedData = formData; // The updated data from the form

      // Dispatch the updateOrder thunk to update the order in the server
      const action = await dispatch(updateOrder({ orderId, updatedData }));

      // Log the response for debugging
      if (action.type === "order/updateOrder/fulfilled") {
        console.log("Order updated successfully", action.payload);

        // Update local state to reflect the updated order
        const updatedOrder = action.payload; // assuming the response contains the updated order
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );

        // Close the modal after the update
        setEditOrderData(null);
      }
    } catch (error) {
      // Handle any errors
      console.error("Error updating order", error);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleEditOrder = (order) => {
    setEditOrderData(order); // Open the modal with the selected order's data
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmation = window.confirm("Are you sure you want to delete this order?");
    if (confirmation) {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Order deleted successfully!");
          setOrders(orders.filter((order) => order._id !== orderId));
          dispatch(fetchAllOrders());
        } else {
          alert("Failed to delete the order.");
        }
      } catch (error) {
        console.error("Error deleting the order:", error);
      }
    }
  };

  const handleDeleteSelected = async () => {
    const confirmation = window.confirm("Are you sure you want to delete the selected orders?");
    if (confirmation) {
      try {
        for (let orderId of selectedOrders) {
          const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            setOrders(orders.filter((order) => order._id !== orderId));
          }
        }
        alert("Selected orders deleted successfully!");
        dispatch(fetchAllOrders());
      } catch (error) {
        console.error("Error deleting selected orders:", error);
      }
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelectedOrders) => {
      if (prevSelectedOrders.includes(orderId)) {
        return prevSelectedOrders.filter((id) => id !== orderId);
      }
      return [...prevSelectedOrders, orderId];
    });
  };

  const handleApplyFilter = () => {
    setFilterApplied(true);
    setShowDateRange(!showDateRange);
  };

  const filteredOrders = allOrders
    .filter((order) => {
      const doctor = doctors.find((doctor) => doctor._id === order.referredBy);
      return (
        order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doctor && doctor.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        order.serialNo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .filter((order) => {
      if (filterApplied) {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate >= selectedDateRange.startDate && orderDate <= selectedDateRange.endDate
        );
      }
      return true; // No date range filter applied, show all orders
    });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true); // Show the button after scrolling 300px
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener when component unmounts
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling effect
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all filtered orders
      setSelectAll(false);
      filteredOrders.forEach((order) => handleSelectOrder(order._id, false));
    } else {
      // Select all filtered orders
      setSelectAll(true);
      filteredOrders.forEach((order) => handleSelectOrder(order._id, true));
    }
  };

  useEffect(() => {
    // Update the "Select All" checkbox if all or none of the filtered orders are selected
    const allSelected =
      filteredOrders.length > 0 &&
      filteredOrders.every((order) => selectedOrders.includes(order._id));
    setSelectAll(allSelected);
  }, [filteredOrders, selectedOrders]);


  return (
    <div className="flex flex-col p-8 space-y-8 mt-16 bg-gray-50 min-h-screen">
      <div className="w-full max-w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Alter Report</h1>

        <div className="mb-6 flex justify-between items-center">
          <Input
            type="text"
            placeholder="Search by name, doctor, or serial no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <Button
            onClick={handleToggleDateRange}
            className="bg-blue-600 text-white mb-6"
          >
            {showDateRange ? "Hide Date Range Filter" : "Show Date Range Filter"}
          </Button>
        </div>
        {showDateRange && (
          <div>
          <div className="mb-6">
            {/* Date Range Picker */}
            <DateRangePicker
  ranges={[selectedDateRange]}
  onChange={(item) => {
    const startDate = item.selection.startDate;
    const endDate = item.selection.endDate;

    // Normalize the date range
    const normalizedStartDate = new Date(startDate).setHours(0, 0, 0, 0); // Start of the day
    const normalizedEndDate = new Date(endDate).setHours(23, 59, 59, 999); // End of the day

    // Update the selected date range
    setSelectedDateRange({
      startDate: new Date(normalizedStartDate),
      endDate: new Date(normalizedEndDate),
      key: "selection",
    });
  }}
  locale={enGB}
/>

          </div>
          <Button
          onClick={handleApplyFilter}
          className="mb-6  text-white py-3 rounded-lg"
        >
          Apply Filter
        </Button>

        <Button
            onClick={resetDateFilter}
            className="px-4 py-2 pr-4 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition"
          >
            Remove Filter
          </Button>

        </div>
        )}

       


        {/* Delete Selected Orders Button */}
        {selectedOrders.length > 0 && (
          <div className="mt-4 mb-4">
            <Button
              className=" bg-red-600 text-white"
              onClick={handleDeleteSelected}
            >
              Delete Selected Orders
            </Button>
          </div>
        )}



        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
            <th className="border px-6 py-3 text-left">
            Select{' '}
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </th>
              <th className="border px-6 py-3 text-left">Serial No</th>
              <th className="border px-6 py-3 text-left">Doctor Ref</th>
              <th className="border px-12 py-3 text-left">Date</th>
              <th className="border px-6 py-3 text-left">Patient name</th>
              <th className="border px-6 py-3 text-left">Category</th>
              <th className="border px-6 py-3 text-left">SubCategory</th>
              <th className="border px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
  {ordersLoading ? (
    <tr>
      <td colSpan="8" className="text-center py-4 text-gray-500">
        Loading...
      </td>
    </tr>
  ) : filteredOrders.length > 0 ? (
    filteredOrders.map((order) => {
      const doctor = doctors.find((doctor) => doctor._id === order.referredBy);
      return (
        <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
          <td className="border px-6 py-4">
            <input
              type="checkbox"
              checked={selectedOrders.includes(order._id)}
              onChange={() => handleSelectOrder(order._id)}
            />
          </td>
          <td className="border px-6 py-4">{order.serialNo}</td>
          <td className="border px-6 py-4">{doctor ? doctor.name : "None"}</td>
          <td className="border px-3 py-4">
            {format(new Date(order.createdAt), "yyyy-MM-dd")}
          </td>
          <td className="border px-6 py-4">{order.name}</td>
          <td className="border px-6 py-4">{order.category}</td>
          <td className="border px-6 py-4">{order.subcategory}</td>
          <td className="border px-6 py-4">
            <div className="flex space-x-3">
              <Button onClick={() => handleViewDetails(order)}>View Details</Button>
              <Button onClick={() => handleEditOrder(order)}>Edit</Button>
              <Button
                className="ml-2 text-red-600"
                onClick={() => handleDeleteOrder(order._id)}
              >
                Delete
              </Button>
            </div>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="8" className="text-center py-4 text-gray-500">
        No orders found
      </td>
    </tr>
  )}
</tbody>

        </table>


      </div>

      {selectedOrder && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedOrder(null)}
          selectedOrder={selectedOrder}
        />
      )}

      {editOrderData && (
        <ModalEditForm
          isOpen={true}
          onClose={() => setEditOrderData(null)}
          onSubmit={handleEditSubmit}
          initialData={editOrderData}
        />
      )}

      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
        style={{ display: showScrollButton ? 'block' : 'none' }}
      >
        ↑
      </button>
    </div>
  );
};

export default AdminOrdersPage;
