import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NewPatientPopUp = ({ setIsAddPatient, phoneNo }) => {
  // Prevent background scrolling when the modal is open
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState(phoneNo || ''); // Default to phoneNo prop if passed
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Collect form data
    const patientData = {
      name,
      age,
      address,
      phoneNo: phone, // Ensure phoneNo is set from the input
    };

    try {
      const response = await axios.post('http://localhost:5000/api/patient/add', patientData);

      if (response.status === 200) {
        // Handle success (you can display a success message here or close the modal)
        setIsAddPatient(false); // Close the modal after successful submission
      }
    } catch (error) {
      // Handle error (you can display an error message here)
      console.error('Error adding patient:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={() => setIsAddPatient(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">User Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="age"
              className="block text-gray-700 font-medium mb-2"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="phoneNo"
              className="block text-gray-700 font-medium mb-2"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNo"
              value={phone} // Allow manual input
              onChange={(e) => setPhone(e.target.value)} // Update phone state on change
              placeholder="Enter your phone number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-gray-700 font-medium mb-2"
            >
              Address
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPatientPopUp;
