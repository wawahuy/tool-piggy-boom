import { Request, Response } from "express";
import * as core from "express-serve-static-core";
import multer from "multer";
import urljoin from "url-join";
import configs from "../../../configs/app";
import ModelAppVersion from "../../../models/schema/app_version";
import { AppVersionForm } from "./model";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, configs.UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, "tool_" + req.body.version + ".apk");
  },
});

export default class AppVersionController {
  static async appVersionView(
    req: Request<core.ParamsDictionary, any, any, any>,
    res: Response
  ) {
    const data = await ModelAppVersion.findOne({});
    res.render("admin/app_version/app_version.view.ejs", {
      version: data?.version,
      detail: data?.detail,
      link: data?.link,
      youtube: data?.youtube,
    });
  }

  static uploadMiddleware = multer({
    storage: storage,
  }).single("file");

  static async appVersionUpdate(
    req: Request<core.ParamsDictionary, any, any, any>,
    res: Response
  ) {
    const data: AppVersionForm = {
      detail: req.body.detail,
      version: req.body.version,
      youtube: req.body.youtube
    };

    const file = req.file;
    if (file) {
      data.link = urljoin(configs.ENDPOINT || "", "/download/", file.filename);
    }

    await ModelAppVersion.updateOne({}, data, { upsert: true });

    AppVersionController.appVersionView(req, res);
  }
}
