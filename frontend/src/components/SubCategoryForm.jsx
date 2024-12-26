import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubCategoryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    referralFee: '',
  });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/subcategories');
      setSubCategories(response.data.Subcategories || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

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
      const response = await axios.post('http://localhost:5000/api/addSubCategory', formData);
      setMessage(response.data.message || 'Subcategory added successfully!');
      setFormData({
        name: '',
        category: '',
        price: '',
        referralFee: '',
      });
      fetchSubCategories();
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while adding the subcategory.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/subcategory/${id}`);
      setMessage('Subcategory deleted successfully!');
      fetchSubCategories();
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while deleting the subcategory.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 mt-24">
      <h1 className="text-3xl font-bold mb-8 text-blue-600">Add SubCategory</h1>
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
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category:
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price:
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="referralFee" className="block text-sm font-medium text-gray-700">
            Referral Fee:
          </label>
          <input
            type="number"
            id="referralFee"
            name="referralFee"
            value={formData.referralFee}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>

      {message && (
        <p className="mt-4 text-lg font-semibold text-green-600">{message}</p>
      )}

      {/* SubCategory List */}
      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">SubCategory List</h2>
        {subCategories.length > 0 ? (
          <table className="table-auto w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Referral Fee</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subCategories.map((subCat) => (
                <tr key={subCat._id} className="border-b text-center">
                  <td className="px-4 py-2">{subCat.name}</td>
                  <td className="px-4 py-2">{subCat.category || 'N/A'}</td>
                  <td className="px-4 py-2">{subCat.price}</td>
                  <td className="px-4 py-2">{subCat.referralFee}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(subCat._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No subcategories available.</p>
        )}
      </div>
    </div>
  );
};

export default SubCategoryForm;
