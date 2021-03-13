import { Request, Response } from 'express';
import path from 'path';

export default class HomeController {
  static homeView(req: Request, res: Response) {
    res.render(path.join(__dirname, 'home.view.ejs'));
  }
}