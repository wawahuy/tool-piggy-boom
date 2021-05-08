import Joi from "joi";
import validateMessage from "../../../middlewares/validator_message";

export default class HomeValidator {
  static login = validateMessage({
    body: Joi.object({
      uid: Joi.number(),
      password: Joi.string()
    }),
  }, true)
}