const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const {
  createPostCtrl,
  fetchSinglePostCtrl,
  fetchAllPostsCtrl,
  updatePostCtrl,
  deletePostCtrl,
  likePostCtrl,
  dislikePostCtrl,
} = require("../../controllers/posts/postsCtrl");
const isAccountVerified = require("../../middlewares/isAccountVerified");

const postsRouter = express.Router();

// ! Create Post - Allows authenticated and verified users to create a new post
postsRouter.post("/", isLoggedIn, isAccountVerified, createPostCtrl);

// ! Fetch All Posts - Retrieve a list of all posts
postsRouter.get("/", fetchAllPostsCtrl);

// ! Fetch Single Post - Retrieve details of a specific post by its ID
postsRouter.get("/:id", fetchSinglePostCtrl);

// ! Update Post - Allows authenticated users to update an existing post by its ID
postsRouter.put("/:id", isLoggedIn, updatePostCtrl);

// ! Delete Post - Allows authenticated users to delete a post by its ID
postsRouter.delete("/:id", isLoggedIn, deletePostCtrl);

// ! Like Post - Allows authenticated users to like a post by its ID
postsRouter.put("/likes/:id", isLoggedIn, likePostCtrl);

// ! Dislike Post - Allows authenticated users to dislike a post by its ID
postsRouter.put("/dislikes/:id", isLoggedIn, dislikePostCtrl);

module.exports = postsRouter;
