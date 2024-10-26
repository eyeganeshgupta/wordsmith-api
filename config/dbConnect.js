const logger = require("./logger");
const mongoose = require("mongoose");

const dbConnect = async () => {
  // Ensure MONGO_URL is defined
  if (!process.env.MONGO_URL) {
    logger.error(`MONGO_URL environment variable is missing`);
    throw new Error("MONGO_URL environment variable is missing");
  }

  try {
    mongoose.set("strictQuery", false);

    const connected = await mongoose.connect(process.env.MONGO_URL);

    logger.info(`MongoDB connected: ${connected.connection.host}`);
  } catch (error) {
    logger.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = dbConnect;
