const mongoose = require("mongoose");

// 👤 Define the user schema
const userSchema = new mongoose.Schema(
  {
    // 📋 Basic user information
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 40,
      unique: true, // Ensure the username is unique
      index: true, // Add an index for performance
    },
    profilePicture: {
      type: Object,
      default: null,
    },
    email: {
      type: String,
      required: false, // Optional email field
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true, // Allow multiple users without an email
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation regex
    },
    password: {
      type: String,
      required: function () {
        return this.authMethod === "local"; // Password is required for local auth
      },
      select: false, // Do not return password field when querying users
    },
    googleId: {
      type: String,
      unique: true, // Ensure Google ID is unique
      sparse: true, // Allow users without Google ID
    },
    authMethod: {
      type: String,
      enum: ["google", "local", "facebook", "github"],
      required: true,
      default: "local",
    },

    // 🔐 Security-related fields
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    accountVerificationToken: {
      type: String,
      default: null,
    },
    accountVerificationExpires: {
      type: Date,
      default: null,
    },

    // 🔑 Account-related fields
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },

    // 🤝 User relationships
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 📝 Posts and 💳 Payments
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],

    // 💰 Earnings and 📊 Plan
    totalEarnings: {
      type: Number,
      default: 0,
    },
    nextEarningDate: {
      type: Date,
      default: () =>
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1), // First day of next month
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    hasSelectedPlan: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// 🔍 Indexes
userSchema.index(
  {
    email: 1,
    googleId: 1,
  },
  {
    unique: true,
    sparse: true,
  }
); // Index for performance on email or googleId

const User = mongoose.model("User", userSchema);

module.exports = User;
