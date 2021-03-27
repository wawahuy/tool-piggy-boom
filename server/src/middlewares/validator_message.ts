import { Request, NextFunction, Response } from "express";
import flash from "express-flash";
import { IValidator } from "../models/validator";

export default function validateMessage(schema: IValidator) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { params, query, body } = req;

    if (schema.params) {
      const valid = schema.params.validate(params);
      if (valid.error) {
        return res.status(405).send(valid.error.message);
      }
    }

    if (schema.query) {
      const valid = schema.query.validate(query);
      if (valid.error) {
        return res.status(405).send(valid.error.message);
      }
    }

    if (schema.body) {
      const valid = schema.body.validate(body);
      if (valid.error) {
        return res.status(405).send(valid.error.message);
      }
    }

    next();
  };
}
