const asyncHandler = require("express-async-handler");
const Comment = require("../../models/Comment/Comment");
const Post = require("../../models/Post/Post");

// @desc Create a Comment
// @route POST /api/v1/comments/:postId
// @access Private
const createCommentCtrl = asyncHandler(async (request, response) => {
  const { content } = request.body;
  const { postId } = request.params;

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

  // Respond with success message
  return response.status(201).json({
    status: "success",
    message: "Comment created successfully.",
    data: comment,
  });
});

module.exports = {
  createCommentCtrl,
};
