const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true, // Index for faster queries
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      index: true, // Optional index for faster queries
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255, // Ensure the message is not too long
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
