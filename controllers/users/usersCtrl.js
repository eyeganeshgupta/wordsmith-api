const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const User = require("../../models/User/User");
const generateToken = require("../../utils/generateToken");
const sendPasswordResetEmail = require("../../utils/sendEmail");
const sendAccountVerificationEmail = require("../../utils/sendAccountVerificationEmail");

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

  const userProfile = await User.findById(userId)
    .populate({
      path: "posts",
      model: "Post",
    })
    .populate({
      path: "following",
      model: "User",
    })
    .populate({
      path: "followers",
      model: "User",
    })
    .populate({
      path: "blockedUsers",
      model: "User",
    })
    .populate({
      path: "profileViewers",
      model: "User",
    });

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

// @desc Un-block user
// @route PUT /api/v1/users/unblock/:userIdToUnblock
// @access private
const unblockUserCtrl = asyncHandler(async (request, response) => {
  const userIdToUnblock = request.params.userIdToUnblock;

  const userToUnblock = await User.findById(userIdToUnblock);
  if (!userToUnblock) {
    const error = new Error(`User not found with id: ${userIdToUnblock}`);
    error.responseStatusCode = 404;
    throw error;
  }

  // Find the current user
  const userIdWhoUnblock = request?.userAuth?._id;
  const loggedInUser = await User.findById(userIdWhoUnblock);

  // Check if user is blocked before unblocking
  if (!loggedInUser?.blockedUsers?.includes(userIdToUnblock)) {
    const error = new Error(`User with id: ${userIdToUnblock} is not blocked.`);
    error.responseStatusCode = 400;
    throw error;
  }

  // remove the user from the current user blocked users array
  loggedInUser.blockedUsers = loggedInUser?.blockedUsers?.filter((id) => {
    return id.toString() !== userIdToUnblock.toString();
  });

  // re-save the current user
  await loggedInUser.save();

  return response.status(200).json({
    status: "success",
    message: "User un-blocked successfully.",
    data: {
      userId: userIdToUnblock,
      unblockedUser: userToUnblock,
    },
  });
});

// @desc Who view my profile
// @route GET /api/v1/users/profile-viewer/:userProfileId
// @access private
const profileViewCtrl = asyncHandler(async (request, response) => {
  const userProfileId = request.params.userProfileId;

  const userProfile = await User.findById(userProfileId);
  if (!userProfile) {
    const error = new Error(`User not found with id: ${userIdToBlock}`);
    error.responseStatusCode = 404;
    throw error;
  }

  const loggedInUserId = request?.userAuth?._id;

  if (!userProfile?.profileViewers?.includes(loggedInUserId)) {
    userProfile.profileViewers.push(loggedInUserId);
    await userProfile.save();
  }

  return response.status(200).json({
    status: "success",
    message: "Profile view recorded successfully.",
    data: {
      profileViewers: userProfile.profileViewers,
    },
  });
});

// @desc Follow a User
// @route PUT /api/v1/users/following/:userIdToFollow
// @access private
const followUserCtrl = asyncHandler(async (request, response) => {
  const currentUserId = request.userAuth?._id;
  const targetUserId = request.params.userIdToFollow;

  // Prevent following oneself
  if (currentUserId.toString() === targetUserId.toString()) {
    const error = new Error(`You are unable to follow your own account.`);
    error.responseStatusCode = 400;
    throw error;
  }

  // Updating the current user's following list
  const updatedCurrentUser = await User.findByIdAndUpdate(
    currentUserId,
    {
      $addToSet: {
        following: targetUserId,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // If the current user does not exist
  if (!updatedCurrentUser) {
    const error = new Error(`Current user not found.`);
    error.responseStatusCode = 404;
    throw error;
  }

  // Updating the target user's followers list
  const updatedTargetUser = await User.findByIdAndUpdate(
    targetUserId,
    {
      $addToSet: {
        followers: currentUserId,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // If the target user does not exist
  if (!updatedTargetUser) {
    const error = new Error(`Target user not found.`);
    error.responseStatusCode = 404;
    throw error;
  }

  return response.status(200).json({
    status: "success",
    message: "You have followed the user successfully!",
    data: {
      currentUser: updatedCurrentUser,
      targetUser: updatedTargetUser,
    },
  });
});

// @desc Un-Follow a User
// @route PUT /api/v1/users/unfollowing/:userIdToUnfollow
// @access private
const unfollowUserCtrl = asyncHandler(async (request, response) => {
  const currentUserId = request.userAuth?._id;
  const targetUserId = request.params.userIdToUnfollow;

  // Prevent unfollowing oneself
  if (currentUserId.toString() === targetUserId.toString()) {
    const error = new Error(`You are unable to un-follow your own account.`);
    error.responseStatusCode = 400;
    throw error;
  }

  // Remove the targetUserId from the current user's following list
  const updatedCurrentUser = await User.findByIdAndUpdate(
    currentUserId,
    {
      $pull: {
        following: targetUserId,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // If the current user does not exist
  if (!updatedCurrentUser) {
    const error = new Error(`Current user not found.`);
    error.responseStatusCode = 404;
    throw error;
  }

  // Remove the currentUserId from the target user's followers list
  const updatedTargetUser = await User.findByIdAndUpdate(
    targetUserId,
    {
      $pull: {
        followers: currentUserId,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // If the target user does not exist
  if (!updatedTargetUser) {
    const error = new Error(`Target user not found.`);
    error.responseStatusCode = 404;
    throw error;
  }

  return response.status(200).json({
    status: "success",
    message: "You have un-followed the user successfully!",
    data: {
      currentUser: updatedCurrentUser,
      targetUser: updatedTargetUser,
    },
  });
});

// @desc Forgot Password
// @route POST /api/v1/users/forgot-password
// @access public
const forgotPasswordCtrl = asyncHandler(async (request, response) => {
  const { email } = request.body;

  const userFound = await User.findOne({ email });

  if (!userFound) {
    const error = new Error(`No account associated with this email address.`);
    error.responseStatusCode = 404;
    throw error;
  }

  const resetToken = await userFound?.generatePasswordResetToken();

  await userFound.save();

  sendPasswordResetEmail(email, resetToken);

  response.status(200).json({
    status: "success",
    message: "A password reset email has been sent to your email address.",
    data: {
      resetToken,
    },
  });
});

// @desc Reset Password
// @route POST /api/v1/users/reset-password/:resetToken
// @access public
const resetPasswordCtrl = asyncHandler(async (request, response) => {
  const { resetToken } = request.params;
  const { password } = request.body;

  // Hashing the provided reset token to compare with the stored token
  const cryptoToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Finding the user by matching the hashed token and checking if the token is still valid
  const userFound = await User.findOne({
    passwordResetToken: cryptoToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!userFound) {
    const error = new Error(`Password reset token is invalid or has expired.`);
    error.responseStatusCode = 401;
    throw error;
  }

  // Generate a salt and hash the new password
  const salt = await bcrypt.genSalt(10);
  userFound.password = await bcrypt.hash(password, salt);

  // Clear the password reset token and expiration fields
  userFound.passwordResetExpires = undefined;
  userFound.passwordResetToken = undefined;

  // Save the updated user information
  await userFound.save();

  response.status(200).json({
    status: "success",
    message: "Password has been reset successfully!",
  });
});

// @route   PUT /api/v1/users/account-verification-email/
// @desc    Send account verification email
// @access  Private
const accountVerificationEmailCtrl = asyncHandler(async (request, response) => {
  // Retrieve the authenticated user's email
  const userFound = await User.findById(request?.userAuth?._id);

  if (!userFound) {
    const error = new Error("User not found.");
    error.responseStatusCode = 404;
    throw error;
  }

  // Generate the verification token
  const verificationToken = await userFound.generateAccountVerificationToken();

  // Save the user with the new token
  await userFound.save();

  // Send the verification email
  sendAccountVerificationEmail(userFound?.email, verificationToken);

  // Respond with success
  return response.status(200).json({
    status: "success",
    message: `Verification email sent successfully to ${userFound?.email}.`,
  });
});

// @route   PUT /api/v1/users/verify-account/:verifyToken
// @desc    Verify account token
// @access  Private
const verifyAccountCtrl = asyncHandler(async (request, response) => {
  // Extract the verification token from the request parameters
  const { verifyToken } = request.params;

  // Convert the token to a hashed format that matches the stored token
  const hashedToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  // Find the user by the hashed token and check if the token has not expired
  const user = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    const error = new Error(
      `Account verification token is invalid or has expired.`
    );
    error.responseStatusCode = 400;
    throw error;
  }

  // Update user account verification status
  user.isVerified = true;
  user.accountVerificationExpires = undefined;
  user.accountVerificationToken = undefined;

  // Save the updated user information
  await user.save();

  return response.status(200).json({
    status: "success",
    message: "Account successfully verified.",
  });
});

// @desc Get user profile
// @route GET /api/v1/users/public-profile/:userId
// @access public
const getPublicProfileCtrl = asyncHandler(async (request, response, next) => {
  const userId = request.params.userId;

  // Check if userId is present
  if (!userId) {
    const error = new Error("Unauthorized access.");
    error.responseStatusCode = 401;
    throw error;
  }

  const userProfile = await User.findById(userId)
    .select("-password")
    .populate({
      path: "posts",
      populate: {
        path: "category",
      },
    });

  // Check if the user profile exists
  if (!userProfile) {
    const error = new Error("User profile not found.");
    error.responseStatusCode = 404;
    throw error;
  }

  // Respond with the user's profile data
  return response.status(200).json({
    status: "success",
    message: userProfile?.username + " profile retrieved successfully.",
    data: userProfile,
  });
});

module.exports = {
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
};
