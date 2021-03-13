import { Request, Response } from 'express';
import path from 'path';

export default class AuthController {
  static loginView(req: Request, res: Response) {
    res.render(path.join(__dirname, 'auth.view.ejs'));
  }
}