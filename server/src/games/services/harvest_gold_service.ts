import { logger } from "../../helpers/logger";
import { UserGoldDetailResponse, UserGoldHarvestResponse } from "../models/game_req/usergold";
import GameService from "./game_services";

export default class HarvestGoldService {
  constructor(private _gameService: GameService) {}

  async getDetail(): Promise<UserGoldDetailResponse> {
    return await this._gameService.req
      .post("/usergold/get/")
      .then((res) => {
        return res?.data;
      })
      .catch((error: Error) => {
        logger.warn(error?.stack?.toString());
        return null;
      });
  }

  async harvestGold(): Promise<UserGoldHarvestResponse> {
    return await this._gameService.req
      .post("/usergold/getGold/")
      .then((res) => {
        return res?.data;
      })
      .catch((error: Error) => {
        logger.warn(error?.stack?.toString());
        return null;
      });
  }
}
