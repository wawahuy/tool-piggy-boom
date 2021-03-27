import { Request, NextFunction, Response } from "express";
import Joi from "joi";
import validateMessage from "../../../middlewares/validator_message";
import { LoggerQuery, pageSize } from "./model";

export default class LoggerValidator {
  static loggerView = validateMessage({
    query: Joi.object<LoggerQuery>({
      date_from: Joi.date().allow(null, ""),
      date_to: Joi.date().allow(null, ""),
      limit: Joi.number().valid(...pageSize).allow(null, ""),
      page: Joi.number().min(1).allow(null, ""),
    }),
  });
}
