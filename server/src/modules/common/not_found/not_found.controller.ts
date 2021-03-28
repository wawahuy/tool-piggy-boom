import { Request, Response } from 'express';
import path from 'path';

export default class NotFoundController {
  static indexView(req: Request, res: Response) {
    res.render('common/not_found/not_found.view.ejs');
  }
}