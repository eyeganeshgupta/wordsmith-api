const mongoose = require("mongoose");

// Post Schema
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
    },
    image: {
      type: Object,
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    claps: {
      type: Number,
      default: 0,
      min: [0, "Claps count cannot be negative"],
    },
    shares: {
      type: Number,
      default: 0,
      min: [0, "Shares count cannot be negative"],
    },
    viewsCount: {
      type: Number,
      default: 0,
      min: [0, "Views count cannot be negative"],
    },
    postViews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    scheduledPublishDate: {
      type: Date,
      default: null, // To allow scheduling posts for future publication
    },
    isBlocked: {
      type: Boolean,
      default: false, // Flag for moderation purposes
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
postSchema.index({ title: 1, author: 1 }); // Efficient querying by title and author
postSchema.index({ category: 1, viewsCount: -1 }); // Fetch popular posts by category
postSchema.index({ likes: 1 }); // For efficiently retrieving posts with many likes

module.exports = mongoose.model("Post", postSchema);
