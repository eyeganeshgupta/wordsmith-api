const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../../models/User/User");
const generateToken = require("../../utils/generateToken");

// @desc Register a new User
// @route POST /api/v1/users/register
// @access public
const registerUserCtrl = asyncHandler(async (request, response) => {
  const { username, password, email } = request.body;

  if (!username || !password || !email) {
    const error = new Error(
      "All fields (username, password, email) are required."
    );
    error.responseStatusCode = 400;
    throw error;
  }

  // Check if the user already exists
  const userFound = await User.findOne({ username });

  if (userFound) {
    const error = new Error(
      "Username is already taken. Please choose a different one."
    );
    error.responseStatusCode = 409;
    throw error;
  }

  // Creating a new user instance
  const newUser = new User({
    username,
    email,
    password,
  });

  // Generate a salt for hashing the password
  const salt = await bcrypt.genSalt(10);

  // Hash the password and assign it to the new user
  newUser.password = await bcrypt.hash(password, salt);

  // Save the new user to the database
  await newUser.save();

  // Respond with success message
  return response.status(201).json({
    status: "success",
    message: "User registered successfully.",
    data: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

// @desc Login user
// @route POST /api/v1/users/login
// @access public
const loginUserCtrl = asyncHandler(async (request, response) => {
  const { username, password } = request.body;

  // Input validation
  if (!username || !password) {
    const error = new Error("Username and password are required.");
    error.responseStatusCode = 400;
    throw error;
  }

  // Finding the user by username
  const userFound = await User.findOne({ username });

  // Checking if user exists
  if (!userFound) {
    const error = new Error("Invalid login credentials.");
    error.responseStatusCode = 401;
    throw error;
  }

  // Comparing the provided password with the stored hashed password
  const isMatched = await bcrypt.compare(password, userFound.password);
  if (!isMatched) {
    const error = new Error("Invalid login credentials.");
    error.responseStatusCode = 401;
    throw error;
  }

  // Update last login timestamp
  userFound.lastLogin = new Date();
  await userFound.save();

  // Respond with success message and token
  return response.status(200).json({
    status: "success",
    message: "User logged in successfully.",
    data: {
      _id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: userFound?.role,
      lastLogin: userFound.lastLogin,
    },
    // Generate a JWT token
    token: generateToken(userFound),
  });
});

// @desc Get user profile
// @route GET /api/v1/users/profile
// @access private
const getUserProfileCtrl = asyncHandler(async (request, response, next) => {
  const userId = request.userAuth?._id;

  // Check if userId is present
  if (!userId) {
    const error = new Error("Unauthorized access.");
    error.responseStatusCode = 401;
    throw error;
  }

  const userProfile = await User.findById(userId);

  // Check if the user profile exists
  if (!userProfile) {
    const error = new Error("User profile not found.");
    error.responseStatusCode = 404;
    throw error;
  }

  // Respond with the user profile data
  return response.status(200).json({
    status: "success",
    message: "User profile retrieved successfully.",
    data: userProfile,
  });
});

// @desc Block user
// @route PUT /api/v1/users/block/:userIdToBlock
// @access private
const blockUserCtrl = asyncHandler(async (request, response) => {
  // Find the user to be blocked
  const { userIdToBlock } = request.params?.userIdToBlock;

  const userToBlock = await User.findById(userIdToBlock);

  if (!userToBlock) {
    const error = new Error(`User not found with id: ${userIdToBlock}`);
    error.responseStatusCode = 404;
    throw error;
  }

  const userIdWhoBlock = request?.userAuth?._id;

  // Check if the user is blocking him/herself
  if (userIdToBlock.toString() === userIdWhoBlock.toString()) {
    const error = new Error(`Cannot block yourself`);
    error.responseStatusCode = 400;
    throw error;
  }

  // Find the current user
  const loggedInUser = await User.findById(userIdWhoBlock);

  // Check if user already blocked
  if (loggedInUser?.blockedUsers?.includes(userIdToBlock)) {
    const error = new Error(`User is already blocked`);
    error.responseStatusCode = 400;
    throw error;
  }

  loggedInUser?.blockedUsers?.push(userIdToBlock);

  const blockSuccess = await loggedInUser.save();

  return response.status(200).json({
    status: "success",
    message: "User blocked successfully.",
    data: {
      blockedUserId: userIdToBlock,
      blockedUsers: loggedInUser.blockedUsers,
      updatedLoggedInUser: blockSuccess,
    },
  });
});

module.exports = {
  registerUserCtrl,
  loginUserCtrl,
  getUserProfileCtrl,
  blockUserCtrl,
};
