import passportConfigs from "../configs/passport";
import combineMiddleware from "../helpers/combine_middleware";
import flash from "express-flash";
import cookieParser from "cookie-parser";
import { sessionMiddleware } from ".";

export const zoneSessionMiddleware = combineMiddleware(
  cookieParser(passportConfigs.COOKIE_SECRET),
  sessionMiddleware,
  flash()
)