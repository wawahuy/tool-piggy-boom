import ModelAccountGame from '../../../models/schema/account_game';

import { Request, Response } from 'express';
import Player from '../../../games/player';
import { AuthRequest } from '../../../games/models/game_req/auth';

export default class AccountGameController {
  static async addAccountGame(req: Request, res: Response) {
    const data = {
      uid: req.body.uid,
      loginType: req.body.data.loginType,
      access_token: req.body.data.access_token,
      deviceToken: req.body.data.deviceToken,
      mac: req.body.data.mac,
      deviceModel: req.body.data.deviceModel,
    };

    if (!await Player.create(<AuthRequest>data)) {
      res.status(401).json({ msg: "Auth failed!" });
      return;
    }

    const r = await ModelAccountGame.updateOne({ uid: req.body.uid }, data, { upsert: true }).then(e => null);
    res.json({ msg: "Auth success!" });
  }
}