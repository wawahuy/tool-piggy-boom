import { ZhuanpanPlayResponse } from "../models/game_req/zhuanpan";
import GameService from "./game_services";
import { logger } from "../../helpers/logger";

export default class ZhuanpanService {
  constructor(private _gameService: GameService) {}

  async callPlay(multiple: number = 1): Promise<ZhuanpanPlayResponse | null> {
    const data = {
      multiple,
    };
    return await this._gameService.req
      .post("zhuanpan/play/", data)
      .then((r) => r.data?.data)
      .catch((error: Error) => {
        logger.warn(error?.stack?.toString());
        return null;
      });
  }
}
