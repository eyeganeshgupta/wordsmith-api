const express = require("express");
const {
  createCategoryCtrl,
  fetchAllCategoriesCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
} = require("../../controllers/categories/categoryCtrl");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const isAccountVerified = require("../../middlewares/isAccountVerified");

const categoryRouter = express.Router();

// ! Create Category
categoryRouter.post("/", isLoggedIn, isAccountVerified, createCategoryCtrl);

// ! Fetch All Categories
categoryRouter.get("/", fetchAllCategoriesCtrl);

// ! Update Category
categoryRouter.put("/:id", isLoggedIn, updateCategoryCtrl);

// ! Delete Category
categoryRouter.delete("/:id", isLoggedIn, deleteCategoryCtrl);

module.exports = categoryRouter;
