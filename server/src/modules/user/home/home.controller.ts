import { Request, Response } from "express";
import ModelAppVersion from "../../../models/schema/app_version";

export default class HomeController {
  static async homeView(req: Request, res: Response) {
    const data = await ModelAppVersion.findOne({});
    res.render("user/home/home.view.ejs", {
      version: data?.version,
      detail: data?.detail,
      link: data?.link,
      youtube: data?.youtube
    });
  }
}
