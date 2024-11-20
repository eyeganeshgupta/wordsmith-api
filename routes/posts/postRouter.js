const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const {
  createPostCtrl,
  fetchSinglePostCtrl,
  fetchAllPostsCtrl,
  updatePostCtrl,
  deletePostCtrl,
} = require("../../controllers/posts/postsCtrl");

const postsRouter = express.Router();

// ! Create Post
postsRouter.post("/", isLoggedIn, createPostCtrl);

// ! Fetch All Posts
postsRouter.get("/", fetchAllPostsCtrl);

// ! Fetch Single Post
postsRouter.get("/:id", fetchSinglePostCtrl);

// ! Update Post
postsRouter.put("/:id", isLoggedIn, updatePostCtrl);

// ! Delete Post
postsRouter.delete("/:id", isLoggedIn, deletePostCtrl);

module.exports = postsRouter;
