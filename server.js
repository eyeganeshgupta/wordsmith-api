"use strict";

const express = require("express");
const dotenv = require("dotenv");
const logger = require("./config/logger");
const Post = require("./models/Post/Post");
const dbConnect = require("./config/dbConnect");

dotenv.config();
dbConnect();

const app = express();

// * Middleware's
app.use(express.json());

// Create post route
app.post("/api/v1/posts/create", async (request, response) => {
  try {
    const { title, content } = request.body;
    const postCreated = await Post.create({ title, content });

    return response.status(201).json({
      status: "success",
      message: "Post created successfully",
      data: postCreated,
    });
  } catch (error) {
    logger.error(`Error creating post: ${error.message}`);
    return response.status(500).json({
      status: "error",
      message: "An error occurred while creating the post",
      error: error.message,
    });
  }
});

// Use PORT from environment variables or default to 2027
const PORT = process.env.PORT || 2027;

const startServer = () => {
  try {
    app.listen(PORT, () => {
      logger.info(`Server is up and running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
