import config from "config";
import path from "node:path";
import winston from "winston";

import { ILoggerConfig } from "@config/types/configTypes";

interface Options {
  file: winston.transports.FileTransportOptions;
  console: winston.transports.ConsoleTransportOptions;
}

const loggerConfig = config.get<ILoggerConfig>("App.logger");

const options: Options = {
  file: {
    level: "info",
    filename: path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "logs",
      "app.log"
    ),
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  },
  console: {
    level: "debug",
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false,
  silent: !loggerConfig.enabled,
});

export default logger;
