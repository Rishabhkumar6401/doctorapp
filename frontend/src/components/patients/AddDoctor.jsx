import { useState } from 'react';
import { useDispatch } from "react-redux";
import axios from 'axios';
import { fetchDoctors } from '../../store/doctor';
import { X } from 'lucide-react'; // Import the cross icon from Lucide

const AddDoctorModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        phoneNo: '',
        address: '',
    });
    const [message, setMessage] = useState('');

    // Handle form field changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Add new doctor form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Ensure the phone number is not empty, set to '0' if empty
        const updatedFormData = {
            ...formData,
            phoneNo: formData.phoneNo || '0', // Set phone number to '0' if empty
        };
        try {
            const response = await axios.post('http://localhost:5000/api/doctor/add', updatedFormData);
            setFormData({
                name: '',
                phoneNo: '',
                address: '',
            });
            setMessage('Doctor added successfully!');
            dispatch(fetchDoctors()); // Fetch the latest list of doctors after adding a new one
            setTimeout(() => {
                setMessage(""); // Clear the message after 2 seconds
                onClose();
            }, 500); // Close the modal after successful addition
        } catch (error) {
            console.error(error);
            setMessage('An error occurred while processing the request.');
        }
    };

    if (!isOpen) return null;  // Modal only shown when isOpen is true

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 relative">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-black hover:text-gray-700"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-center mb-6">Add New Doctor</h2>

                <form onSubmit={handleSubmit}>
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
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
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
                            pattern="^\d{10}$" // Only allows 10 digits
                            title="Please enter a 10-digit phone number" // Custom error message
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
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
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700"
                    >
                        Add Doctor
                    </button>
                </form>

                {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
            </div>
        </div>
    );
};

export default AddDoctorModal;
