const express = require("express");
const {
  createCategoryCtrl,
} = require("../../controllers/categories/categoryCtrl");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const categoryRouter = express.Router();

// ! Create Category
categoryRouter.post("/", isLoggedIn, createCategoryCtrl);

module.exports = categoryRouter;
