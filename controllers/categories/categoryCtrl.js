const asyncHandler = require("express-async-handler");
const Category = require("../../models/Category/Category");

// @desc Create a new category
// @route POST /api/v1/categories
// @access private
const createCategoryCtrl = asyncHandler(async (request, response) => {
  const { name } = request.body;

  // Input validation
  if (!name) {
    const error = new Error("Category name is required.");
    error.responseStatusCode = 400;
    throw error;
  }

  // Check if the category already exists
  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    const error = new Error("Category already exists.");
    error.responseStatusCode = 409;
    throw error;
  }

  // Create the new category
  const category = await Category.create({
    name,
    author: request.userAuth._id, // Assuming userAuth is set by an isLoggedIn authentication middleware
  });

  return response.status(201).json({
    status: "success",
    message: "Category created successfully.",
    data: category,
  });
});

// @desc Fetch all categories
// @route GET /api/v1/categories
// @access public
const fetchAllCategoriesCtrl = asyncHandler(async (request, response) => {
  const categories = await Category.find({});
  response.status(200).json({
    status: "success",
    message: "Category successfully fetched",
    data: categories,
  });
});

// @desc Update a category
// @route PUT /api/v1/categories/:id
// @access private
const updateCategoryCtrl = asyncHandler(async (request, response) => {
  const { name } = request.body;
  const { id } = request.params;

  // Check if the category exists
  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    { name },
    { new: true, runValidators: true }
  );

  // If the category was not found, respond with a 404 status
  if (!updatedCategory) {
    const error = new Error("Category not found.");
    error.responseStatusCode = 404;
    throw error;
  }

  // Respond with success message
  return response.status(200).json({
    status: "success",
    message: "Category updated successfully.",
    data: updatedCategory,
  });
});

// @desc Delete a category
// @route DELETE /api/v1/categories/:id
// @access private
const deleteCategoryCtrl = asyncHandler(async (request, response) => {
  const id = request.params.id;

  // Check if the category exists
  const deletedCategory = await Category.findByIdAndDelete(id);

  // If the category was not found, respond with a 404 status
  if (!deletedCategory) {
    const error = new Error("Category not found.");
    error.responseStatusCode = 404;
    throw error;
  }

  return response.status(200).json({
    status: "success",
    message: "Category successfully deleted.",
    data: deletedCategory,
  });
});

module.exports = {
  createCategoryCtrl,
  fetchAllCategoriesCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
};
