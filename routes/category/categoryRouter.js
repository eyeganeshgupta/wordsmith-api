const express = require("express");
const {
  createCategoryCtrl,
  fetchAllCategoriesCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
} = require("../../controllers/categories/categoryCtrl");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const categoryRouter = express.Router();

// ! Create Category
categoryRouter.post("/", isLoggedIn, createCategoryCtrl);

// ! Fetch All Categories
categoryRouter.get("/", fetchAllCategoriesCtrl);

// ! Update Category
categoryRouter.put("/:id", isLoggedIn, updateCategoryCtrl);

module.exports = categoryRouter;
