import connect from "connect";
import { Handler } from "express";

export default function combineMiddleware(
  ...middlewares: Handler[]
) {
  const chain = connect();
  middlewares.forEach(function(middleware) {
    chain.use(<connect.NextHandleFunction>middleware);
  });
  return chain;
}