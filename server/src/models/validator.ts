import Joi from "joi";

export interface IValidator {
  params?: Joi.Schema;
  query?: Joi.Schema;
  body?: Joi.Schema;
}