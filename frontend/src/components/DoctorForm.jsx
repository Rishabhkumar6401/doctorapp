import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const DoctorForm = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    phoneNo: '',
    address: '',
  });

  useEffect(() => {
    if (location.state) {
      setFormData(location.state);
    }
  }, [location.state]);

  const doctorId = location.state?._id;



  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (doctorId) {
        // Update Doctor
        response = await axios.put(`http://localhost:5000/api/doctor/${doctorId}`, formData);
        setMessage(response.data.message || 'Doctor updated successfully!');
      } else {
        // Add New Doctor
        response = await axios.post('http://localhost:5000/api/doctor/add', formData);
        setMessage(response.data.message || 'Doctor added successfully!');
        setFormData({
          name: '',
          phoneNo: '',
          address: '',
        });
      }
      // Navigate back after success
      setTimeout(() => navigate('/admin/doctors'), 2000);
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while processing the request.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-blue-600"> {doctorId ? 'Update Doctor' : 'Add Doctor'}</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

       

        <div className="mb-4">
          <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
            Phone No:
          </label>
          <input
            type="text"
            id="phoneNo"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address:
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
  

       

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {doctorId ? 'Update' : 'Submit'}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-lg font-semibold text-green-600">{message}</p>
      )}
    </div>
  );
};

export default DoctorForm;
