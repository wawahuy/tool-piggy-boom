import { Request, Response } from 'express';
import moment from 'moment';

export default class HomeController {
  static homeView(req: Request, res: Response) {
    const data = {
      timeUTC: moment().utc().format('YYYY/MM/DD HH:mm:ssZ'),
    }
    res.render("admin/home/home.view.ejs", data);
  }
}