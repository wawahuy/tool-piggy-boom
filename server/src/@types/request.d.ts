import * as core from "express-serve-static-core";

declare module "express" {
  interface Request<P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = core.Query> extends core.Request<P, ResBody, ReqBody, ReqQuery> {
    ipReal?: string | string[];
  }
}