import { Request, Response } from 'express';
import path from 'path';

export default class ProxyProhibitionController {
  static indexView(req: Request, res: Response) {
    if (!req.isProxyProhibition) {
      return res.redirect("/");
    }

    res.render(path.join(__dirname, 'proxy_prohibition.view.ejs'));
  }
}