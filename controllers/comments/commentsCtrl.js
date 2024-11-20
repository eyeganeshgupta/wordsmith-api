const asyncHandler = require("express-async-handler");
const Comment = require("../../models/Comment/Comment");
const Post = require("../../models/Post/Post");

// @desc Create a Comment
// * @route POST /api/v1/comments/:postId
// @access Private
const createCommentCtrl = asyncHandler(async (request, response) => {
  const { content } = request.body;
  const { postId } = request.params;

  // Validate input
  if (!content) {
    const error = new Error(`Comment content is required.`);
    error.responseStatusCode = 400;
    throw error;
  }

  const comment = await Comment.create({
    content,
    author: request?.userAuth?._id,
    post: postId,
  });

  const updatedPost = Post.findByIdAndUpdate(
    postId,
    { $push: { comments: comment?._id } },
    { new: true }
  );

  return response.status(201).json({
    status: "success",
    message: "Comment has been successfully created.",
    data: comment,
  });
});

// @desc Update a Comment
// * @route PUT /api/v1/comments/:id
// @access private
const updateCommentCtrl = asyncHandler(async (request, response) => {
  const { id } = request.params;
  const { content } = request.body.content;

  // Validate input
  if (!content) {
    const error = new Error(`Comment content is required.`);
    error.responseStatusCode = 400;
    throw error;
  }

  const updatedComment = await Post.findByIdAndUpdate(
    id,
    { content: content },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedComment) {
    const error = new Error(`No comment found with the specified ID: ${id}.`);
    error.responseStatusCode = 404;
    throw error;
  }

  return response.status(200).json({
    status: "success",
    message: `Comment updated successfully with content: ${updatedComment?.content}.`,
    data: updatedComment,
  });
});

// @desc Delete a Comment
// * @route DELETE /api/v1/comments/:id
// @access private
const deleteCommentCtrl = asyncHandler(async (request, response) => {
  const { id } = request.params;

  const deletedComment = await Post.findByIdAndDelete(id);

  if (!deletedComment) {
    const error = new Error(`No comment found with the specified ID: ${id}.`);
    error.responseStatusCode = 404;
    throw error;
  }

  return response.status(200).json({
    status: "success",
    message: "Comment has been successfully deleted.",
    data: deletedComment,
  });
});

module.exports = {
  createCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
};
