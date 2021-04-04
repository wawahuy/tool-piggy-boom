import { Request, Response } from "express";
import Player from "../../../games/player";
import { AuthRequest } from "../../../games/models/game_req/auth";
import { EPushAccountCode, IPushAccountResponse } from "./model";
import appConfigs from '../../../configs/app';

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

    let player: Player | null;
    if (!(player = await Player.create(<AuthRequest>data))) {
      res.status(401).json({
        msg: "Auth failed!",
        code: EPushAccountCode.MSG,
      } as IPushAccountResponse);
      return;
    }

    const pwd = await player.getOrGeneratePwd();
    const response: IPushAccountResponse = {};

    // if (!await player.stillExpiredDate()) {
    if (false) {
      // response.code = EPushAccountCode.MSG;
      // response.msg = 
      //   `Xin chào, ${player.authDataResponse?.name}!\r\n` +
      //   `Bạn đã kết nối thành công đến Heo Đến Rồi Tools, tuy nhiên bạn không thể vào game do account không còn thời gian dùng tools.\r\n` +
      //   `Thêm thời gian sử dụng trong 24h (miễn phí) bạn truy cập vào:\n` +
      //   `   ${appConfigs.ENDPOINT}\n` +
      //   `   UID: ${player.authDataResponse?.uid}\n` + 
      //   `   Mật khẩu: ${pwd}\n` + 
      //   `Cảm ơn bạn!`
    } else {
      response.code = EPushAccountCode.SUCCESS;
      response.msg = 'pwd: ' + pwd;
    }

    res.json(response);
  }
}
