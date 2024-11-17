const bcrypt = require("bcryptjs");
const logger = require("../../config/logger");
const User = require("../../models/User/User");

// @desc Register a new User
// @route POST /api/v1/users/register
// @access public
const registerUserCtrl = async (request, response) => {
  const { username, password, email } = request.body;

  if (!username || !password || !email) {
    return response.status(400).json({
      status: "fail",
      message: "All fields (username, password, email) are required.",
    });
  }

  try {
    // Check if the user already exists
    const userFound = await User.findOne({ username });

    if (userFound) {
      return response.status(409).json({
        status: "fail",
        message: "Username is already taken. Please choose a different one.",
      });
    }

    // Create a new user instance
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
  } catch (error) {
    logger.error(`Error in registering the user: ${error.message}`);

    return response.status(500).json({
      status: "error",
      message:
        "An unexpected error occurred while processing your request. Please try again later.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message, // Hiding error details in production
    });
  }
};

// @desc Login user
// @route POST /api/v1/users/login
// @access public
const loginUserCtrl = async (request, response) => {
  const { username, password } = request.body;

  // Input validation
  if (!username || !password) {
    return response.status(400).json({
      status: "fail",
      message: "Username and password are required.",
    });
  }

  try {
    // Finding the user by username
    const userFound = await User.findOne({ username });

    // Checking if user exists
    if (!userFound) {
      return response.status(401).json({
        status: "fail",
        message: "Invalid login credentials.",
      });
    }

    // Comparing the provided password with the stored hashed password
    const isMatched = await bcrypt.compare(password, userFound.password);
    if (!isMatched) {
      return response.status(401).json({
        status: "fail",
        message: "Invalid login credentials.",
      });
    }

    // Update last login timestamp
    userFound.lastLogin = new Date();
    await userFound.save();

    // Generate a JWT token

    // Respond with success message and token
    return response.status(200).json({
      status: "success",
      message: "User logged in successfully.",
      data: {
        _id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        lastLogin: userFound.lastLogin,
      },
    });
  } catch (error) {
    logger.error(`Error in logging the user: ${error.message}`);

    return response.status(500).json({
      status: "error",
      message:
        "An unexpected error occurred while processing your request. Please try again later.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message, // Hiding error details in production
    });
  }
};

module.exports = {
  registerUserCtrl,
  loginUserCtrl,
};
