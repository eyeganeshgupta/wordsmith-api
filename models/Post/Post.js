const mongoose = require("mongoose");
const validator = require("validator");

// 👤 Define the post schema
const postSchema = new mongoose.Schema(
  {
    // 📋 Basic post information
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      minlength: 2,
      maxlength: 100,
      unique: true,
      index: true,
    },
    image: {
      type: String,
      required: false,
      validate: {
        validator: (v) => validator.isURL(v),
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    content: {
      type: String,
      required: [true, "Content is required."],
      trim: true,
      minlength: 2,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Author is required."],
      ref: "User",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Category is required."],
      ref: "Category",
    },

    // 🔢 Engagement-related fields
    claps: {
      type: Number,
      default: 0,
      min: 0,
    },
    shares: {
      type: Number,
      default: 0,
      min: 0,
    },
    postViews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 💬 Interaction-related fields
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

    // 📅 Scheduling-related fields
    scheduledPublished: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// 🔍 Indexes
postSchema.index({ title: 1 });
postSchema.index({ author: 1 });
postSchema.index({ category: 1 });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
