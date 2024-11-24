const mongoose = require("mongoose");
const crypto = require("crypto");

// 👤 Define the user schema
const userSchema = new mongoose.Schema(
  {
    // 📋 Basic user information
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true, // Allow multiple users without an email
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    accountLevel: {
      type: String,
      enum: ["bronze", "silver", "gold"],
      default: "bronze",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    notificationPreferences: {
      email: { type: String, default: true },
    },
    gender: {
      type: String,
      enum: ["male", "female", "prefer not to say", "non-binary"],
    },

    // 🤝 User relationships
    profileViewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // 📝 User activities
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

    // 🔐 Security-related fields
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    accountVerificationToken: {
      type: String,
    },
    accountVerificationExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Method to generate a password reset token
userSchema.methods.generatePasswordResetToken = function () {
  // Generate a random reset token using 20 bytes of cryptographically strong random data
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the reset token using SHA-256 and store it in the passwordResetToken field
  // This ensures that the actual token is not stored in the database for security reasons
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the expiration time for the password reset token to 10 minutes from now
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Compile schema to model
const User = mongoose.model("User", userSchema);

module.exports = User;
