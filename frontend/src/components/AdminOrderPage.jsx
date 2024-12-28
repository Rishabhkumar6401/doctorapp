"use client"; // Add this directive at the top

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import  Modal  from "./model";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { fetchAllOrders } from "../store/order"; 
import { useDispatch, useSelector } from "react-redux";


const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [editOrderData, setEditOrderData] = useState(null);
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
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
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
          window.location.reload();
          // Remove the deleted order from the state
          setOrders(orders.filter((order) => order._id !== orderId));
        } else {
          alert("Failed to delete the order.");
        }
      } catch (error) {
        console.error("Error deleting the order:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-8 mt-24">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Patient Reports</h1>

        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 px-4 py-2 text-left">Serial No</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Patient Name</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Doctor Referral</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order) => {
              const doctor = doctors.find((doctor) => doctor._id === order.referredBy);

              return (
                <tr key={order._id}>
                  <td className="border border-gray-200 px-4 py-2">{order.serialNo}</td>
                  <td className="border border-gray-200 px-4 py-2">{order.name}</td>
                  <td className="border border-gray-200 px-4 py-2">
                    {format(new Date(order.createdAt), "yyyy-MM-dd")}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">{doctor ? doctor.name : "None"}</td>
                  <td className="border border-gray-200 px-4 py-2 text-left">
  <div className="flex space-x-2"> {/* Flexbox container with spacing */}
    <Button onClick={() => handleViewDetails(order)}>View Details</Button>
    <Button className="ml-2" onClick={() => handleDeleteOrder(order._id)}>
      Delete
    </Button>
  </div>
</td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
  <Modal 
    isOpen={true} 
    onClose={() => setSelectedOrder(null)} 
    selectedOrder={selectedOrder} // Pass selectedOrder as prop
  />
)}

    </div>
  );
};

export default AdminOrdersPage;
