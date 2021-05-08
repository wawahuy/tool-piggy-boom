import { Request, Response } from "express";
import { EFeature, EFeatureSnowBall, EFeatureType, listFeature } from "../../../models/feature";
import { IAccountGameDocument } from "../../../models/schema/account_game";
import ModelAppVersion from "../../../models/schema/app_version";

export default class HomeController {
  static async homeView(req: Request, res: Response) {
    if (req.isAuthenticated()) {
      return HomeController.userView(req, res);
    }

    const data = await ModelAppVersion.findOne({});
    res.render("user/home/home.view.ejs", {
      version: data?.version,
      detail: data?.detail,
      link: data?.link,
      youtube: data?.youtube,
      error: req.flash('error'),
    });
  }

  static async userView(req: Request, res: Response) {
    const data = await ModelAppVersion.findOne({});
    const user = <IAccountGameDocument>req.user;
    res.render("user/home/user.view.ejs", {
      version: data?.version,
      detail: data?.detail,
      link: data?.link,
      youtube: data?.youtube,
      error: req.flash('error'),
      name: user.name,
      EFeatureType: EFeatureType,
      listFeature,
    });
  }
}
