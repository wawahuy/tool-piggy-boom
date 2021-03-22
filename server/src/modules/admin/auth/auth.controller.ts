import { Request, Response } from 'express';
import path from 'path';

export default class AuthController {
  static loginView(req: Request, res: Response) {
    res.render('admin/auth/auth.view.ejs');
  }
}