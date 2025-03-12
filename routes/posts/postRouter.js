const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const multer = require("multer");
const {
  createPostCtrl,
  fetchSinglePostCtrl,
  fetchAllPostsCtrl,
  updatePostCtrl,
  deletePostCtrl,
  likePostCtrl,
  dislikePostCtrl,
  clapOnPostCtrl,
  schedulePostCtrl,
  fetchPublicPostCtrl,
} = require("../../controllers/posts/postsCtrl");
const isAccountVerified = require("../../middlewares/isAccountVerified");
const storage = require("../../utils/fileUpload");

const postsRouter = express.Router();

const upload = multer({ storage });

// ! Create Post - Allows authenticated and verified users to create a new post
postsRouter.post(
  "/",
  isLoggedIn,
  isAccountVerified,
  upload.single("file"),
  createPostCtrl
);

// ! Fetch All Posts - Retrieve a list of all posts
postsRouter.get("/", isLoggedIn, fetchAllPostsCtrl);

// ! Fetch Public Posts - Retrieve a list of latest 4 posts
postsRouter.get("/public-posts", fetchPublicPostCtrl);

// ! Fetch Single Post - Retrieve details of a specific post by its ID
postsRouter.get("/:id", fetchSinglePostCtrl);

// ! Update Post - Allows authenticated users to update an existing post by its ID
postsRouter.put("/:id", isLoggedIn, upload.single("file"), updatePostCtrl);

// ! Delete Post - Allows authenticated users to delete a post by its ID
postsRouter.delete("/:id", isLoggedIn, deletePostCtrl);

// ! Like Post - Allows authenticated users to like a post by its ID
postsRouter.put("/likes/:id", isLoggedIn, likePostCtrl);

// ! Dislike Post - Allows authenticated users to dislike a post by its ID
postsRouter.put("/dislikes/:id", isLoggedIn, dislikePostCtrl);

postsRouter.put("/claps/:id", isLoggedIn, clapOnPostCtrl);

postsRouter.put("/schedule/:postId", isLoggedIn, schedulePostCtrl);

module.exports = postsRouter;
