const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const {
  createPostCtrl,
  fetchSinglePostCtrl,
  fetchAllPostsCtrl,
  updatePostCtrl,
  deletePostCtrl,
  likePostCtrl,
} = require("../../controllers/posts/postsCtrl");
const isAccountVerified = require("../../middlewares/isAccountVerified");

const postsRouter = express.Router();

// ! Create Post
postsRouter.post("/", isLoggedIn, isAccountVerified, createPostCtrl);

// ! Fetch All Posts
postsRouter.get("/", fetchAllPostsCtrl);

// ! Fetch Single Post
postsRouter.get("/:id", fetchSinglePostCtrl);

// ! Update Post
postsRouter.put("/:id", isLoggedIn, updatePostCtrl);

// ! Delete Post
postsRouter.delete("/:id", isLoggedIn, deletePostCtrl);

// ! Like Post
postsRouter.put("/:id", isLoggedIn, likePostCtrl);

module.exports = postsRouter;
