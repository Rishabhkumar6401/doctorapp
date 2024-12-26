const SubCategory = require('../Model/SubCategory');

// Add Category
const AddSubCategory = async (req, res) => {
  try {
    const { name, category, price, referralFee } = req.body;

    // Create and save the new category
    const newCategory = new SubCategory({ name, category, price, referralFee});
    await newCategory.save();

    res.status(201).json({
      message: "SubCategory added successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding subcategory",
      error: error.message,
    });
  }
};

// Update Category
const UpdateSubCategory = async (req, res) => {
  try {
    const { id } = req.params; // Get category ID from request params
    const {  name, category, price, referralFee } = req.body;

    const updatedCategory = await SubCategory.findByIdAndUpdate(
      id,
      {  name, category, price, referralFee },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        message: "SubCategory not found",
      });
    }

    res.status(200).json({
      message: "SubCategory updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating Subcategory",
      error: error.message,
    });
  }
};

// Get Category By ID
const getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await SubCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "SubCategory not found",
      });
    }

    res.status(200).json({
      message: "SubCategory fetched successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Subcategory",
      error: error.message,
    });
  }
};
const getSubCategoryByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    // Fetch subcategories based on the category
    const subcategories = await SubCategory.find({ category });

    // Check if subcategories are found
    if (subcategories.length === 0) {
      return res.status(404).json({
        message: "No subcategories found for the given category",
      });
    }

    // Return the fetched subcategories
    res.status(200).json({
      message: "Subcategories fetched successfully",
      subcategories,
    });
  } catch (error) {
    // Handle server error
    res.status(500).json({
      message: "Error fetching subcategories",
      error: error.message,
    });
  }
};


const DeleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params; // Extract category ID from request parameters
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'SubCategory ID is required',
      });
    }

    // Find and delete the category by ID
    const deletedCategory = await SubCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: 'SubCategory not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'SubCategory deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting Subcategory:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the Subcategory',
      error: error.message,
    });
  }
};

// Get All Categories
const getAllSubCategory = async (req, res) => {
  try {
    const Subcategories = await SubCategory.find();

    res.status(200).json({
      message: "SubCategories fetched successfully",
      Subcategories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Subcategories",
      error: error.message,
    });
  }
};

module.exports = {
  AddSubCategory,
  UpdateSubCategory,
  getSubCategoryById,
  getAllSubCategory,
  DeleteSubCategory,
  getSubCategoryByCategory,
};
