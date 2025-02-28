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
    image: request?.file?.path,
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

// @desc  Get all posts
// @route GET /api/v1/posts
// @access Private
const fetchAllPostsCtrl = asyncHandler(async (request, response) => {
  // Find all users who have blocked the logged-in user
  const loggedInUserId = request.userAuth?._id;

  const usersBlockingLoggedInUser = await User.find({
    blockedUsers: loggedInUserId,
  });

  // Extract the IDs of users who have blocked the logged-in user
  const blockingUserIds = usersBlockingLoggedInUser.map((user) => user._id);

  const currentTime = new Date();

  const query = {
    author: {
      $nin: blockingUserIds,
    },
    $or: [
      {
        scheduledPublished: {
          $lte: currentTime,
        },
        scheduledPublished: null,
      },
    ],
  };

  const posts = await Post.find(query);

  // Send success response
  return response.status(200).json({
    status: "success",
    message: "Posts successfully fetched.",
    data: posts,
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

// @desc  Get public posts
// @route GET /api/v1/posts/public
// @access Public
const fetchPublicPostCtrl = asyncHandler(async (request, response) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .limit(4)
    .populate("category");

  return response.status(200).json({
    status: "success",
    message: "Posts successfully fetched.",
    data: posts,
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

// @desc   Like a post
// @route  PUT /api/v1/posts/likes/:id
// @access Private
const likePostCtrl = asyncHandler(async (request, response) => {
  // Retrieve the post ID from the request parameters
  const { id: postId } = request.params;
  // Get the authenticated user's ID
  const userId = request.userAuth._id;

  // Find the post by ID
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error(`Post not found.`);
    error.responseStatusCode = 404;
    throw error;
  }

  // Add the user to the post's likes if not already liked
  await Post.findByIdAndUpdate(
    postId,
    {
      $addToSet: { likes: userId },
    },
    { new: true }
  );

  // Remove the user from the dislikes array if present
  post.dislikes = post.dislikes.filter(
    (dislike) => dislike.toString() !== userId.toString()
  );

  // Save the updated post
  await post.save();

  // Respond with a success message and the updated post
  return response.status(200).json({
    status: "success",
    message: "Post liked successfully.",
    data: post,
  });
});

// @desc   Dislike a post
// @route  PUT /api/v1/posts/dislikes/:id
// @access Private
const dislikePostCtrl = asyncHandler(async (request, response) => {
  // Retrieve the post ID from the request parameters
  const { id: postId } = request.params;
  // Get the authenticated user's ID
  const userId = request.userAuth._id;

  // Find the post by ID
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error(`Post not found.`);
    error.responseStatusCode = 404;
    throw error;
  }

  // Add the user to the post's dislikes if not already disliked
  await Post.findByIdAndUpdate(
    postId,
    {
      $addToSet: { dislikes: userId },
    },
    { new: true }
  );

  // Remove the user from the likes array if present
  post.likes = post.likes.filter(
    (like) => like.toString() !== userId.toString()
  );

  // Save the updated post
  await post.save();

  // Respond with a success message and the updated post
  return response.status(200).json({
    status: "success",
    message: "Post disliked successfully.",
    data: post,
  });
});

// @desc   Clap on a post
// @route  PUT /api/v1/posts/claps/:id
// @access Private
const clapOnPostCtrl = asyncHandler(async (request, response) => {
  const { id } = request.params;

  // Find the post by ID
  const post = await Post.findById(id);
  if (!post) {
    const error = new Error(`Post not found.`);
    error.responseStatusCode = 404;
    throw error;
  }

  // Increment the clap count for the post
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { $inc: { claps: 1 } },
    { new: true }
  );

  // Respond with a success message and the updated post data
  return response.status(200).json({
    status: "success",
    message: "Post clapped successfully.",
    data: updatedPost,
  });
});

//@desc   Schedule a post
//@route  PUT /api/v1/posts/schedule/:postId
//@access Private
const schedulePostCtrl = asyncHandler(async (request, response) => {
  // Extracting payload and parameters
  const { scheduledPublish } = request.body;
  const { postId } = request.params;

  // Validating required fields
  if (!postId || !scheduledPublish) {
    const error = new Error(`Post ID and scheduled publish date are required.`);
    error.responseStatusCode = 400;
    throw error;
  }

  // Finding the post by ID
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error(`Post not found.`);
    error.responseStatusCode = 404;
    throw error;
  }

  // Verifying if the user is the author of the post
  if (post.author.toString() !== request.userAuth._id.toString()) {
    const error = new Error(
      `You are only authorized to schedule your own posts.`
    );
    error.responseStatusCode = 403;
    throw error;
  }

  // Checking if the scheduled publish date is in the past
  const scheduleDate = new Date(scheduledPublish);
  const currentDate = new Date();
  if (scheduleDate < currentDate) {
    const error = new Error(
      `The scheduled publish date cannot be in the past.`
    );
    error.responseStatusCode = 403;
    throw error;
  }

  // Updating the scheduled publish date of the post
  post.scheduledPublished = scheduledPublish;
  await post.save();

  return response.status(200).json({
    status: "success",
    message: "Post scheduled successfully.",
    data: post,
  });
});

module.exports = {
  createPostCtrl,
  fetchAllPostsCtrl,
  fetchSinglePostCtrl,
  fetchPublicPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  likePostCtrl,
  dislikePostCtrl,
  clapOnPostCtrl,
  schedulePostCtrl,
};
