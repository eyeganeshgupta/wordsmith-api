const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const {
  createCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
} = require("../../controllers/comments/commentsCtrl");

const commentRouter = express.Router();

commentRouter.post("/:postId", isLoggedIn, createCommentCtrl);

commentRouter.put("/:id", isLoggedIn, updateCommentCtrl);

commentRouter.delete("/:id", isLoggedIn, deleteCommentCtrl);

module.exports = commentRouter;
