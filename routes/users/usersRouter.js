const express = require("express");
const {
  registerUserCtrl,
  loginUserCtrl,
  getUserProfileCtrl,
  blockUserCtrl,
  unblockUserCtrl,
  profileViewCtrl,
  followingUserCtrl,
} = require("../../controllers/users/usersCtrl");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const usersRouter = express.Router();

// ! User Registration - Create a new account for a user
usersRouter.post("/register", registerUserCtrl);

// ! User Login - Authenticate a user and grant access
usersRouter.post("/login", loginUserCtrl);

// ! Get User Profile - Retrieve the logged-in user's profile information
usersRouter.get("/profile", isLoggedIn, getUserProfileCtrl);

// ! Block User - Prevent a specific user from interacting with you
usersRouter.put("/block/:userIdToBlock", isLoggedIn, blockUserCtrl);

// ! Unblock User - Allow a previously blocked user to interact with you again
usersRouter.put("/unblock/:userIdToUnblock", isLoggedIn, unblockUserCtrl);

// ! Profile Viewer - View another user's profile details
usersRouter.get("/profile-viewer/:userProfileId", isLoggedIn, profileViewCtrl);

// ! Follow User - Start following another user to see their updates
usersRouter.get("/following/:userIdToFollow", isLoggedIn, followingUserCtrl);

module.exports = usersRouter;
