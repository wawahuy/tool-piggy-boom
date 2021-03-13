import ModelAccountGame from '../../../models/schema/account_game';

import { Request, Response } from 'express';
import path from 'path';

export default class AccountGameController {
  static async addAccountGame(req: Request, res: Response) {
    const m = {
      uid: req.body.uid,
      loginType: req.body.data.loginType,
      access_token: req.body.data.access_token,
      deviceToken: req.body.data.deviceToken,
      mac: req.body.data.mac,
      deviceModel: req.body.data.deviceModel,
    };
    const r  = await ModelAccountGame.updateOne({ uid: req.body.uid }, m, { upsert: true }).then(e => null);
    res.send(r);
  }
}