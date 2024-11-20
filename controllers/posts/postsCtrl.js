const asyncHandler = require("express-async-handler");
const Post = require("../../models/Post/Post");
const User = require("../../models/User/User");
const Category = require("../../models/Category/Category");

// @desc Create a Post
// @route POST /api/v1/posts
// @access Private
const createPostCtrl = asyncHandler(async (request, response) => {
  const { title, content, categoryId } = request.body;

  // Check if the post already exists
  const postFound = await Post.findOne({ title });
  if (postFound) {
    const error = new Error(`Post with title: "${title}" already exists.`);
    error.responseStatusCode = 409;
    throw error;
  }

  // Create the new post
  const newPost = await Post.create({
    title,
    content,
    category: categoryId,
    author: request.userAuth._id,
  });

  // Update the author and category with the new post
  await User.findByIdAndUpdate(request.userAuth._id, {
    $push: { posts: newPost._id },
  });

  await Category.findByIdAndUpdate(categoryId, {
    $push: { posts: newPost._id },
  });

  // Respond with success message
  return response.status(201).json({
    status: "success",
    message: "Post created successfully.",
    data: newPost,
  });
});

// @desc Fetch all Posts
// @route GET /api/v1/posts
// @access public
const fetchAllPostsCtrl = asyncHandler(async (request, response) => {
  const allPosts = await Post.find({}).populate("author");
  response.status(200).json({
    status: "success",
    message: "Posts successfully fetched.",
    data: allPosts,
  });
});

// @desc Fetch single Post
// @route GET /api/v1/posts/:id
// @access public
const fetchSinglePostCtrl = asyncHandler(async (request, response) => {
  const { id } = request.params;

  const post = await Post.findById(id).populate("author");

  if (!post) {
    const error = new Error(`Post not found with id: ${id}`);
    error.responseStatusCode = 404;
    throw error;
  }

  response.status(200).json({
    status: "success",
    message: "Post successfully fetched.",
    data: post,
  });
});

// @desc Update a Post
// @route PUT /api/v1/posts/:id
// @access private
const updatePostCtrl = asyncHandler(async (request, response) => {
  const { id } = request.params;

  const updatedPost = await Post.findByIdAndUpdate(id, request.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedPost) {
    const error = new Error(`Post not found with id: ${id}`);
    error.responseStatusCode = 404;
    throw error;
  }

  // Respond with success message
  return response.status(200).json({
    status: "success",
    message: "Post updated successfully.",
    data: updatedPost,
  });
});

// @desc Delete a Post
// @route DELETE /api/v1/posts/:id
// @access private
const deletePostCtrl = asyncHandler(async (request, response) => {
  const { id } = request.params;

  const deletedPost = await Post.findByIdAndDelete(id);

  if (!deletedPost) {
    const error = new Error(`Post not found with id: ${id}`);
    error.responseStatusCode = 404;
    throw error;
  }

  return response.status(200).json({
    status: "success",
    message: "Post successfully deleted.",
    data: deletedPost,
  });
});

module.exports = {
  createPostCtrl,
  fetchAllPostsCtrl,
  fetchSinglePostCtrl,
  updatePostCtrl,
  deletePostCtrl,
};