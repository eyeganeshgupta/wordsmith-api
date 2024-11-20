const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const {
  createCommentCtrl,
} = require("../../controllers/comments/commentsCtrl");

const commentRouter = express.Router();

commentRouter.post("/:postId", isLoggedIn, createCommentCtrl);

module.exports = commentRouter;
