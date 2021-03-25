import winston from "winston";
import "winston-mongodb";
import dbConfigs from "../configs/db";
import appConfigs from "../configs/app";

const alignedWithColorsAndTime = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...args } = info;

    const ts = timestamp.slice(0, 19).replace("T", " ");
    return `${ts} [${level}]: ${message} ${
      Object.keys(args).length ? JSON.stringify(args, null, 2) : ""
    }`;
  })
);

export const transportConsole = new winston.transports.Console({
  format: alignedWithColorsAndTime,
});

export const transportMongo = new winston.transports.MongoDB({
  db: dbConfigs.MONGO_URI as string,
  collection: dbConfigs.LOG_DB,
  expireAfterSeconds: 30 * 24 * 60 * 60,
});

export const logger = winston.createLogger({
  transports: [transportConsole, ...(appConfigs ? [transportMongo] : [])],
});
