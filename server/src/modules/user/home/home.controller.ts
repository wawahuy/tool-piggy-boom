import { Request, Response } from 'express';

export default class HomeController {
  static homeView(req: Request, res: Response) {
    res.render("admin/home/home.view.ejs");
  }
}