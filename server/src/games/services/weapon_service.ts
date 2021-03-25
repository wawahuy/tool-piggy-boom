import { FireRequest, FireResponse, StealResponse } from "../models/game_req/weapon";
import GameService from "./game_services";
import { logger } from "../../helpers/logger";
export default class WeaponService {
  constructor(private _gameService: GameService) {}

  async callSteal(id: number): Promise<StealResponse | null> {
    const data = {
      id,
    };
    return await this._gameService.req
      .post("userweapon/steal/", data)
      .then((r) => r.data?.data)
      .catch((error: Error) => {
        logger.warn(error?.stack?.toString());
        return null;
      });
  }

  async callFire(data: FireRequest): Promise<FireResponse | null> {
    return await this._gameService.req
      .post("userweapon/attack/", data)
      .then((r) => r.data)
      .catch((error: Error) => {
        logger.warn(error?.stack?.toString());
        return null;
      });
  }
}
