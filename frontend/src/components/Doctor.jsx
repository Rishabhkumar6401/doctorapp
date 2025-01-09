import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../store/doctor";
import axios from "axios";

const Doctor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { doctors } = useSelector((state) => state.doctors);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const handleEdit = (doctor) => {
    navigate("/admin/addDoctor", { state: doctor });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await axios.delete(`http://localhost:5000/api/doctor/${id}`);
        alert("Doctor deleted successfully!");
        // Reload or fetch updated doctors list
        dispatch(fetchDoctors()); // Assuming you have a function to fetch and update the doctors list
      } catch (error) {
        console.error("Error deleting doctor:", error);
        alert("An error occurred while deleting the doctor. Please try again.");
      }
    }
  };
  

  useEffect(() => {
    if (doctors) {
      setFilteredDoctors(
        doctors.filter((doctor) =>
          `${doctor.name} ${doctor.phoneNo}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, doctors]);

  return (
    <div className="min-h-screen bg-gray-100 mt-16">
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-900 text-white px-6 py-4 shadow-md">
        <h1 className="text-2xl font-bold">Doctor Management</h1>
        <div className="flex space-x-4">
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            onClick={() => navigate("/admin/addDoctor")}
          >
            Add New Doctor
          </button>
          {/* <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            onClick={() => navigate("/admin/doctorReport")}
          >
            Doctors Report
          </button> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        {/* Search Bar */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search by name or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Doctor List */}
        <div className="bg-white rounded-md shadow-md">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">
                  Name
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">
                  Phone Number
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">
                  Address
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">
                  Overall Total Commison
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors && filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-100">
                    <td className="py-3 px-4 border-b">{doctor.name}</td>
                    <td className="py-3 px-4 border-b">{doctor.phoneNo}</td>
                    <td className="py-3 px-4 border-b">{doctor.address}</td>
                    <td className="py-3 px-4 border-b">{doctor.totalCommission}</td>
                    <td className="py-3 px-4 border-b">
                      <button
                        onClick={() => handleEdit(doctor)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doctor._id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="py-3 px-4 text-center text-gray-500"
                  >
                    No doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Doctor;
