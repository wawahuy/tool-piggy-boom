import { RewardAdType } from "../models/game_req/reward";
import { logger } from "../../helpers/logger";
import GameService from "./game_services";

export default class RewardService {
  constructor(private _gameService: GameService) {}

  async popAd(name: RewardAdType) {
    return await this._gameService.req
      .post("/videoAD/pop/", { name })
      .then((res) => {
        return res?.data;
      })
      .catch((error: Error) => {
        logger.warn(error?.stack?.toString());
        return null;
      });
  }

  async rewardAd(name: RewardAdType, param?: Object) {
    return await this._gameService.req
      .post("/videoAD/reward/", { name, param })
      .then((res) => {
        return res?.data;
      })
      .catch((error: Error) => {
        logger.warn(error?.stack?.toString());
        return null;
      });
  }
}
