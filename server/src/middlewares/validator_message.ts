import { Request, NextFunction, Response } from "express";
import flash from "express-flash";
import { IValidator } from "../models/validator";

export default function validateMessage(schema: IValidator, flashCheck: boolean = false) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { params, query, body } = req;

    if (schema.params) {
      const valid = schema.params.validate(params);
      if (valid.error) {
        if (flashCheck) {
          req.flash('error', valid.error.message);
          return next();
        }
        return res.status(405).send(valid.error.message);
      }
    }

    if (schema.query) {
      const valid = schema.query.validate(query);
      if (valid.error) {
        if (flashCheck) {
          req.flash('error', valid.error.message);
          return next();
        }
        return res.status(405).send(valid.error.message);
      }
    }

    if (schema.body) {
      const valid = schema.body.validate(body);
      if (valid.error) {
        if (flashCheck) {
          req.flash('error', valid.error.message);
          return next();
        }
        return res.status(405).send(valid.error.message);
      }
    }

    next();
  };
}
