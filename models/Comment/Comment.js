const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [1, "Comment content must be at least 1 character"],
      maxlength: [500, "Comment content cannot exceed 500 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post reference is required"],
    },
  },
  { timestamps: true }
);

// Indexing for optimized query performance
commentSchema.index({ post: 1, createdAt: -1 }); // Retrieve comments by post and sort by most recent

module.exports = mongoose.model("Comment", commentSchema);
