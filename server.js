"use strict";

const express = require("express");
const dotenv = require("dotenv");
const winston = require("winston");

dotenv.config();

const app = express();

// Use PORT from environment variables or default to 2027
const PORT = process.env.PORT || 2027;

// Initializing a logger using winston for better logging practices
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

const startServer = () => {
  try {
    app.listen(PORT, () => {
      logger.info(`Server is up and running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error?.message}`);
    process.exit(1); // Exit with a failure code
  }
};

// Start the server
startServer();
