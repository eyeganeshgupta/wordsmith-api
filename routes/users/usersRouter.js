const express = require("express");
const {
  registerUserCtrl,
  loginUserCtrl,
  getUserProfileCtrl,
  blockUserCtrl,
  unblockUserCtrl,
} = require("../../controllers/users/usersCtrl");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const usersRouter = express.Router();

// ! Register
usersRouter.post("/register", registerUserCtrl);
// ! Login
usersRouter.post("/login", loginUserCtrl);
// ! Get Profile
usersRouter.get("/profile", isLoggedIn, getUserProfileCtrl);
// ! Block User
usersRouter.put("/block/:userIdToBlock", isLoggedIn, blockUserCtrl);
// ! Un-block User
usersRouter.put("/unblock/:userIdToUnblock", isLoggedIn, unblockUserCtrl);

module.exports = usersRouter;
