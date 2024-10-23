const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    // 📝 Post Content
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title must be at least 1 characters long"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [3, "Description must be at least 3 characters long"],
    },
    image: {
      type: Object,
      validate: {
        validator: function (v) {
          return v && v.url && typeof v.url === "string"; // Ensuring image object has a URL property
        },
        message: "Image must have a valid URL",
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },

    // 💰 Financial Data
    nextEarningDate: {
      type: Date,
      default: () =>
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1), // Default to the first day of the next month
    },
    thisMonthEarnings: {
      type: Number,
      default: 0,
      min: [0, "Earnings cannot be negative"],
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: [0, "Total earnings cannot be negative"],
    },

    // 📊 Metrics
    viewsCount: {
      type: Number,
      default: 0,
      min: [0, "Views count cannot be negative"],
    },

    // 👍 Interactions
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
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 💬 Comments
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    // 🚫 Moderation
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🔍 Indexing
postSchema.index({ likes: 1 });
postSchema.index({ dislikes: 1 });
postSchema.index({ viewers: 1 });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
