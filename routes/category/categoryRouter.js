const express = require("express");
const {
  createCategoryCtrl,
  fetchAllCategoriesCtrl,
} = require("../../controllers/categories/categoryCtrl");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const categoryRouter = express.Router();

// ! Create Category
categoryRouter.post("/", isLoggedIn, createCategoryCtrl);

// ! Fetch All Categories
categoryRouter.get("/", fetchAllCategoriesCtrl);

module.exports = categoryRouter;
