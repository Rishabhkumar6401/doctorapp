import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Category = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-10 px-6">
      {/* Container for buttons */}
      <div className="w-full max-w-md space-y-6 bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Manage Categories</h2>
        
        <Button
          className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg py-3 text-lg transition duration-200"
          onClick={() => navigate('/admin/addCategory')}
        >
          Add Category
        </Button>

        <Button
          className="w-full bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg py-3 text-lg transition duration-200"
          onClick={() => navigate('/admin/addSubcategory')}
        >
          Add Sub Category
        </Button>
      </div>
    </div>
  );
};

export default Category;
