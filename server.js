"use strict";

const express = require("express");
const dotenv = require("dotenv");
const winston = require("winston");
const Post = require("./models/Post/Post");

dotenv.config();

const app = express();

app.use(express.json());

// Initialized a logger using Winston for consistent logging practices
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "server.log" }),
  ],
});

// ! Create post
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
    process.exit(1); // Exit with a failure code
  }
};

startServer();
