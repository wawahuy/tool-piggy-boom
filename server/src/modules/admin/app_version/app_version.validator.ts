import Joi from "joi";
import validateMessage from "../../../middlewares/validator_message";

export default class AppVersionValidator {
  static appVersionForm = validateMessage({
    body: Joi.object({
      detail: Joi.string().allow('', null),
      version: Joi.string(),
      file: Joi.any(),
      youtube: Joi.string().allow('', null)
    }),
  });
}
