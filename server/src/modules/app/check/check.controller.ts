import { Request, Response } from "express";
import { wsProxyManager } from "../../../realtimes/proxy";

export default class CheckController {
  static async check(req: Request, res: Response) {
    // test response ip's
    res.json({
      version: '1.1.1',
    });
  }
}
