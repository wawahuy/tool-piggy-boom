import { Request, Response } from 'express';

export default class HomeController {
  static homeView(req: Request, res: Response) {
    res.render("user/home/home.view.ejs");
  }
}