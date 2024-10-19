const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
      unique: true,
      validate: {
        validator: function (value) {
          // Regular expression to allow letters, numbers, spaces, dots, hyphens, and underscores
          return /^[a-zA-Z0-9.\-_ ]+$/.test(value);
        },
        message: "Category name must only contain letters and numbers",
      },
      set: (value) => value.trim().toLowerCase(),
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
      set: (value) => value.trim(),
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Creating index on categoryName for optimized queries
categorySchema.index({ categoryName: 1 });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
