"use strict";

const express = require("express");
const dotenv = require("dotenv");
const logger = require("./config/logger");
const dbConnect = require("./config/dbConnect");
const usersRouter = require("./routes/users/usersRouter");
const {
  notFound,
  globalErrorHandler,
} = require("./middlewares/globalErrorHandler");

dotenv.config();
dbConnect();

const app = express();

// * Middleware's
app.use(express.json());

// * Routes
app.use("/api/v1/users", usersRouter);

// * Error Middleware
app.use(notFound);
app.use(globalErrorHandler);

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
