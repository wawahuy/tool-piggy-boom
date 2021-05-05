import { Request, Response } from "express";
import * as core from "express-serve-static-core";
import multer from "multer";
import urljoin from "url-join";
import configs from "../../../configs/app";
import ModelAppVersion from "../../../models/schema/app_version";

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
      link: data?.link
    });
  }

  static uploadMiddleware = multer({
    storage: storage,
  }).single("file");

  static async appVersionUpdate(
    req: Request<core.ParamsDictionary, any, any, any>,
    res: Response
  ) {
    const file = req.file;
    if (!file) {
      res.status(400).send("Upload failed!");
      return;
    }

    await ModelAppVersion.updateOne(
      {},
      {
        detail: req.body.detail,
        version: req.body.version,
        link: urljoin(configs.ENDPOINT || "", "/download/", file.filename),
      },
      { upsert: true }
    );

    AppVersionController.appVersionView(req, res);
  }
}
