import Joi from "joi";
import validateMessage from "../../../middlewares/validator_message";

export default class AuthValidator {
  static login = validateMessage({
    body: Joi.object({
      username: Joi.string(),
      password: Joi.string()
    })
  })
}