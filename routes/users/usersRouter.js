const express = require("express");
const {
  registerUserCtrl,
  loginUserCtrl,
  getUserProfileCtrl,
} = require("../../controllers/users/usersCtrl");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const usersRouter = express.Router();

// ! Register
usersRouter.post("/register", registerUserCtrl);
// ! Login
usersRouter.post("/login", loginUserCtrl);
// ! Get Profile
usersRouter.get("/profile", isLoggedIn, getUserProfileCtrl);

module.exports = usersRouter;
