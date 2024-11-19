const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
const User = require("../models/User/User");

const isLoggedIn = async (request, response, next) => {
  const token = request.headers.authorization?.split(" ")[1];

  // Check if token is provided
  if (!token) {
    return response.status(401).json({
      status: "fail",
      message: "Authorization token is required.",
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded?.id; // Adjusted to match the decoded structure

    const user = await User.findById(userId).select("username email role _id");

    if (!user) {
      return response.status(404).json({
        status: "fail",
        message: "Token expired / invalid, Please login again.",
      });
    }

    // Attach user information to the request object
    request.userAuth = user;
    next();
  } catch (error) {
    logger.error(`Error in isLoggedIn middleware: ${error.message}`);

    // Check if the error is related to token verification
    if (error.name === "JsonWebTokenError") {
      return response.status(401).json({
        status: "fail",
        message: "Invalid token.",
      });
    }

    // Handle other errors
    return response.status(500).json({
      status: "error",
      message: "An unexpected error occurred while processing your request.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};

module.exports = isLoggedIn;
