import { AuthRequest, AuthResponse, ELoginType } from "./models/game_req/auth";
import { GameServiceConfig } from "./models/game_req/game";
import ModelAccountGame from "../models/schema/account_game";
import AuthService from "./services/auth_service";
import BCLogService from "./services/bclog_service";
import GameService from "./services/game_services";
import moment from "moment";

export default class Player {
  _gameService: GameService;
  _bcService: BCLogService;

  private constructor(
    private _authData: AuthResponse,
    private _authRequest: AuthRequest
  ) {
    const gameData: GameServiceConfig = {
      uid: this._authData.uid,
      skey: this._authData.skey,
      mtkey: this._authData.mtkey,
      deviceToken: this._authData.deviceToken,
    };
    this._gameService = new GameService(gameData);
    this._bcService = new BCLogService();
  }

  static async create(auth: AuthRequest) {
    const authService = new AuthService();
    const authResponse = await authService.login(auth).catch((res) => null);
    if (!authResponse) {
      return null;
    }
    const instance = new Player(authResponse, auth);
    await instance.insertOrUpdateAccount();
    return instance;
  }

  async insertOrUpdateAccount() {
    const data = {
      uid: this._authData.uid,
      mtkey: this._authData.mtkey,
      skey: this._authData.skey,
      loginType: this._authRequest.loginType,
      access_token: this._authRequest.access_token,
      deviceToken: this._authRequest.deviceToken,
      mac: this._authRequest.mac,
      deviceModel: this._authRequest.deviceModel,
    };
    try {
      await ModelAccountGame.updateOne({ uid: this._authData.uid }, data, {
        upsert: true,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async updateSyncDate() {
    const data = {
      syncDate: moment().toDate(),
    };
    try {
      await ModelAccountGame.updateOne({ uid: this._authData.uid }, data, {
        upsert: true,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async close() {
    this.updateSyncDate();
  }
}
