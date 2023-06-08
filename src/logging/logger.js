const winston = require("winston");
const path = require("path");
require("dotenv").config();
const customFormat = winston.format.printf(
  ({ level, message, timestamp, method, url, statusCode }) => {
    let result = `[${timestamp}] [${level.toUpperCase()}]: ${message} ${
      method || ""
    } ${url || ""}`;
    if (statusCode) {
      result = `[${timestamp}] [${level.toUpperCase()}]: ${message} - ${method} ${url} | Status: ${statusCode}`;
    }

    return result;
  }
);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    customFormat
  ),
  transports: [
    new winston.transports.File({
      level: "error",
      filename: path.join(__dirname, "./logs/error.log"),
    }),
    new winston.transports.File({
      level: "info",
      filename: path.join(__dirname, "./logs/info.log"),
    }),
  ],
});

module.exports = logger;
