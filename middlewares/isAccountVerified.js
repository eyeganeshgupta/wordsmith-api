const User = require("../models/User/User");

const isAccountVerified = async (request, response, next) => {
  try {
    // Retrieving the authenticated user
    const authenticatedUser = await User.findById(request.userAuth._id);

    // Checking if the user is verified
    if (authenticatedUser?.isVerified) {
      return next(); // Proceed to the next middleware
    } else {
      return response
        .status(401)
        .json({ status: "fail", message: "Account not verified." });
    }
  } catch (error) {
    console.error("Error checking account verification:", error);
    return response
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

module.exports = isAccountVerified;
