const express = require("express");
const multer = require("multer");
const {
  registerUserCtrl,
  loginUserCtrl,
  getUserProfileCtrl,
  blockUserCtrl,
  unblockUserCtrl,
  profileViewCtrl,
  followUserCtrl,
  unfollowUserCtrl,
  forgotPasswordCtrl,
  resetPasswordCtrl,
  accountVerificationEmailCtrl,
  verifyAccountCtrl,
  getPublicProfileCtrl,
  uploadProfilePicture,
  uploadCoverImage,
  updateUserProfile,
} = require("../../controllers/users/usersCtrl");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const storage = require("../../utils/fileUpload");

const usersRouter = express.Router();

const upload = multer({ storage });

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
usersRouter.put("/following/:userIdToFollow", isLoggedIn, followUserCtrl);

// ! Unfollow User - Stop following a user to no longer see their updates
usersRouter.put("/unfollowing/:userIdToUnfollow", isLoggedIn, unfollowUserCtrl);

// ! Forgot Password - Initiate the password recovery process
usersRouter.post("/forgot-password", forgotPasswordCtrl);

// ! Reset Password - Update the user's password using a reset token
usersRouter.post("/reset-password/:resetToken", resetPasswordCtrl);

// ! Send Account Verification Email - send verification email to the logged-in user
usersRouter.put(
  "/account-verification-email",
  isLoggedIn,
  accountVerificationEmailCtrl
);

// ! Verify account token
usersRouter.put("/verify-account/:verifyToken", isLoggedIn, verifyAccountCtrl);

usersRouter.get("/public-profile/:userId", isLoggedIn, getPublicProfileCtrl);

usersRouter.put(
  "/profile-picture",
  isLoggedIn,
  upload.single("file"),
  uploadProfilePicture
);

usersRouter.put(
  "/cover-image",
  isLoggedIn,
  upload.single("file"),
  uploadCoverImage
);

usersRouter.put("/update-profile", isLoggedIn, updateUserProfile);

module.exports = usersRouter;
