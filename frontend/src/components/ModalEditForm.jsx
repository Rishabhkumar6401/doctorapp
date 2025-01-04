import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../store/doctor";
import { fetchCategories } from '../store/categories';
import {  fetchSubcategoryDetail } from '../store/subcategories';
import axios from 'axios';

const ModalEditForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const dispatch = useDispatch();
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  // Redux state
  const { doctors } = useSelector((state) => state.doctors);
  const { categories} = useSelector((state) => state.categories);
  const { subcategory, loading} = useSelector((state) => state.subcategory);
  


  // Local state for form fields
  const [formData, setFormData] = useState({
    phoneNo: "",
    name: "",
    age: "",
    address: "",
    referredBy: "",
    category: "",
    subcategory: "",
    fees: "",
    discount: "",
    finalPayment: "",
    paymentMode: "",
   
  });

  // Initialize form data if editing existing data
  useEffect(() => {
    if (initialData) {
      console.log("Initial Data received in Modal:", initialData.fees);
      setFormData({
        phoneNo: initialData.phoneNo || "",
        name: initialData.name || "",
        age: initialData.age || "",
        address: initialData.address || "",
        referredBy: initialData.referredBy || "",
        category: initialData.category || "",
        subcategory: initialData.subcategory || "",
        fees: initialData.fees || "",
        discount: initialData.discount || "",
        finalPayment: initialData.finalPayment || "",
        paymentMode: initialData.paymentMode || "",
      });
    }
  }, [initialData]);
  

  // Fetch data on mount or when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchDoctors());
       dispatch(fetchCategories()); 
    }
  }, [isOpen, dispatch]);

  // Handle input change
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Update formData with the changed value
    setFormData((prevState) => {
      const updatedFormData = {
        ...prevState,
        [name]: value,
      };
  
      // If fees or discount change, recalculate finalPayment
      if (name === "fees" || name === "discount") {
        let fees = name === "fees" ? parseFloat(value) || 0 : parseFloat(updatedFormData.fees) || 0;
        let discount = name === "discount" ? parseInt(value) || 0 : parseInt(updatedFormData.discount) || 0;

  
        // Update finalPayment after validation
        updatedFormData.finalPayment = fees - discount;
      }
  
      return updatedFormData;
    });
  };
  
  

  useEffect(() => {
    const fetchSubcategoriesByCategory = async () => {
      if (!formData.category) {
        setFilteredSubcategories([]); // Clear subcategories if no category is selected
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/subcategory?category=${formData.category}`
        );
        setFilteredSubcategories(response.data.subcategories); // Update subcategories based on category
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubcategoriesByCategory();
  }, [formData.category]);

  useEffect(() => {
     
    
      if (formData.subcategory) {
        dispatch(fetchSubcategoryDetail(formData.subcategory));
      }
    }, [formData.subcategory]);

     useEffect(() => {
        if (subcategory) {
          setFormData((prevState) => ({
            ...prevState,
            fees: subcategory.price || '',
            finalPayment: subcategory.price || '',
            
          }));
        }
      }, [subcategory]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass formData to parent or Redux action
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Form</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
              />
            </div>
  
            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNo"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
              />
            </div>
  
            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
              />
            </div>
  
            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
              />
            </div>
  
            {/* Referred By (Doctor Select) */}
           
<div>
  <label htmlFor="referredBy" className="block text-sm font-medium text-gray-700">
    Referred By
  </label>
  <select
    id="referredBy"
    name="referredBy"
    value={formData.referredBy || ""}  // Default value is an empty string if referredBy is null or 0
    onChange={handleChange}
    className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
  >
    <option value="">Select Doctor</option>
    <option value="0">None</option>
    {doctors?.map((doctor) => (
      <option key={doctor.id} value={doctor._id}>
        {doctor.name} {/* Display doctor's name */}
      </option>
    ))}
  </select>
</div>



  
            {/* Category (Select Dropdown) */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
              >
                <option value="">Select Category</option>
                {/* Add categories here */}
                {categories?.map((category) => (
      <option key={category.id} value={category.name}>
        {category.name} {/* Display doctor's name */}
      </option>
    ))}
              </select>
            </div>
  
            {/* Subcategory (Select Dropdown) */}
          {/* Subcategory (Select Dropdown) */}
<div>
  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
    Subcategory
  </label>
  <select
    id="subcategory"
    name="subcategory"
    value={formData.subcategory || ""} // Ensure formData.subcategory is used for the value
    onChange={handleChange}
    className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
  >
    <option value="">Select Subcategory</option>
    {filteredSubcategories?.map((sub) => (
      <option key={sub._id} value={sub._id} selected={formData.subcategory === sub._id}>
        {sub.name}
      </option>
    ))}
  </select>
</div>

  
            {/* Fees */}
            <div>
              <label htmlFor="fees" className="block text-sm font-medium text-gray-700">
                Fees
              </label>
              <input
                type="text"
                id="fees"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
              />
            </div>
  
            {/* Discount */}
            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                Discount
              </label>
              <input
                type="text"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
              />
            </div>
  
            {/* Final Payment */}
           {/* Final Payment */}
<div>
  <label htmlFor="finalPayment" className="block text-sm font-medium text-gray-700">
    Final Payment
  </label>
  <input
    type="text"
    id="finalPayment"
    name="finalPayment"
    value={formData.finalPayment}
    onChange={handleChange} // You might want to prevent manual edits here
    className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
    readOnly
    
  />
</div>

  
            {/* Payment Mode */}
            <div>
  <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700">
    Payment Mode
  </label>
  <select
    id="paymentMode"
    name="paymentMode"
    value={formData.paymentMode}
    onChange={handleChange}
    className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
  >
    <option value="">Select Payment Mode</option>
    <option value="Cash">Cash</option>
    <option value="Online">Online</option>
  </select>
</div>

  
            {/* Referral Fee */}
          
  
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                // disabled={subcategoryLoading}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Update Report
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
  
  
};

export default ModalEditForm;
