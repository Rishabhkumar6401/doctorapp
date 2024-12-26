import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../store/doctor";

const Doctor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { doctors } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

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
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            onClick={() => navigate("/admin/doctorReport")}
          >
            Doctors Report
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        {/* Summary Section */}
        <div className="flex justify-between items-center bg-white p-4 rounded-md shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Total Doctors: {doctors ? doctors.length : 0}
          </h2>
        </div>

        {/* Doctor List */}
        <div className="bg-white rounded-md shadow-md">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">
                  ID
                </th> */}
                <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">
                  Name
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">
                  Phone Number
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {doctors && doctors.length > 0 ? (
                doctors.map((doctor, index) => (
                  <tr key={doctor.id} className="hover:bg-gray-100">
                    {/* <td className="py-3 px-4 border-b">{doctor.id}</td> */}
                    <td className="py-3 px-4 border-b">{doctor.name}</td>
                    <td className="py-3 px-4 border-b">{doctor.phoneNo}</td>
                    <td className="py-3 px-4 border-b">{doctor.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
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
