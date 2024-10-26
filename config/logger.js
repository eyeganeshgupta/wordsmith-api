const winston = require("winston");
const moment = require("moment");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      const formattedDate = moment(timestamp).format("DD-MM-YYYY HH:mm:ss");
      return `[${formattedDate}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "server.log" }),
  ],
});

module.exports = logger;
