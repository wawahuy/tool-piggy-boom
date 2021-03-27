import { Request, Response } from 'express';
import moment from 'moment';
import appConfigs from "../../../configs/app"; 

export default class HomeController {
  static homeView(req: Request, res: Response) {
    const data = {
      timeUTC: moment().utcOffset(appConfigs.UTC_OFFSET).format('YYYY/MM/DD HH:mm:ssZ'),
    }
    res.render("admin/home/home.view.ejs", data);
  }
}