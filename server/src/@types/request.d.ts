import * as core from "express-serve-static-core";

declare module "express" {
  interface Request<P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = core.Query>  {
    ipReal?: string | string[];
  }
}