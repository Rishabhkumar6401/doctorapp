const Category = require('../Model/Category');

// Add Category
const AddCategory = async (req, res) => {
  try {
    const { name } = req.body;
    

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name: name });
    if (existingCategory) {
      return res.status(400).json({
        message: "This name is already present",
      });
    }

    // Create and save the new category
    const newCategory = new Category({ name: name });
    await newCategory.save();

    res.status(201).json({
      message: "Category added successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding category",
      error: error.message,
    });
  }
};

// Update Category
const UpdateCategory = async (req, res) => {
  try {
    const { id } = req.params; // Get category ID from request params
    const { name } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name:name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating category",
      error: error.message,
    });
  }
};

// Get Category By ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching category",
      error: error.message,
    });
  }
};

const DeleteCategory = async (req, res) => {
  try {
    const { id } = req.params; // Extract category ID from request parameters
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required',
      });
    }

    // Find and delete the category by ID
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the category',
      error: error.message,
    });
  }
};

// Get All Categories
const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

const fetchAllCategoriesFromDB = async () => {
  try {
    // Fetch all categories from the database
    const categories = await Category.find();

    if (categories.length === 0) {
      throw new Error("No categories found");
    }

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error; // Propagate error to the caller
  }
};


module.exports = {
  AddCategory,
  UpdateCategory,
  getCategoryById,
  getAllCategory,
  DeleteCategory,
  fetchAllCategoriesFromDB,
};
