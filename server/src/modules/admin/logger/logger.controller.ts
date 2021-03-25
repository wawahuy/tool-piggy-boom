import { Request, Response } from 'express';

export default class LoggerController {
  static loggerView(req: Request, res: Response) {
    res.render("admin/logger/logger.view.ejs");
  }
}