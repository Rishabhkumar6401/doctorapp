"use client"; // Add this directive at the top

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

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editOrderData, setEditOrderData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const { allOrders, loading: ordersLoading } = useSelector((state) => state.order);

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
      if (action.type === 'order/updateOrder/fulfilled') {
        console.log('Order updated successfully', action.payload);

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
      console.error('Error updating order', error);
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

  const filteredOrders = allOrders.filter((order) => {
    const doctor = doctors.find((doctor) => doctor._id === order.referredBy);
    return (
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doctor && doctor.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.serialNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col p-8 space-y-8 mt-16 bg-gray-50 min-h-screen">
      <div className="w-full max-w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Patient Orders</h1>

        <div className="mb-6 flex justify-between items-center">
          <Input
            type="text"
            placeholder="Search by name, doctor, or serial no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="border px-6 py-3 text-left">Serial No</th>
              <th className="border px-6 py-3 text-left">Patient Name</th>
              <th className="border px-6 py-3 text-left">Date</th>
              <th className="border px-6 py-3 text-left">Doctor Referral</th>
              <th className="border px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const doctor = doctors.find((doctor) => doctor._id === order.referredBy);
                return (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="border px-6 py-4">{order.serialNo}</td>
                    <td className="border px-6 py-4">{order.name}</td>
                    <td className="border px-6 py-4">
                      {format(new Date(order.createdAt), "yyyy-MM-dd")}
                    </td>
                    <td className="border px-6 py-4">{doctor ? doctor.name : "None"}</td>
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
                <td colSpan="5" className="text-center py-4 text-gray-500">No orders found</td>
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
    </div>
  );
};

export default AdminOrdersPage;
