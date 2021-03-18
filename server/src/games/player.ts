import { AuthRequest, AuthResponse, ELoginType } from "./models/game_req/auth";
import { GameServiceConfig } from "./models/game_req/game";
import ModelAccountGame from "../models/schema/account_game";
import AuthService from "./services/auth_service";
import BCLogService from "./services/bclog_service";
import GameService from "./services/game_services";
import moment from "moment";
import WeaponService from "./services/weapon_service";
import { Firetarget } from "./models/game/fire";
import _ from "lodash";
import { EFireAttackType, FireRequest } from "./models/game_req/weapon";

export default class Player {
  _gameService: GameService;
  _bcService: BCLogService;
  _weaponService: WeaponService;

  get uidGame() {
    return this._authData.uid;
  }

  get isFullTili() {
    return Number(this._authData.zhuanpan.tili) == this._authData.zhuanpan.maxTili;
  }

  private constructor(
    private _authData: AuthResponse,
    private _authRequest: AuthRequest
  ) {
    console.log(this._authData);
    const gameData: GameServiceConfig = {
      uid: this.uidGame,
      skey: this._authData.skey,
      mtkey: this._authData.mtkey,
      deviceToken: this._authData.deviceToken,
    };
    this._gameService = new GameService(gameData);
    this._weaponService = new WeaponService(this._gameService);
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
      uid: this.uidGame,
      mtkey: this._authData.mtkey,
      skey: this._authData.skey,
      loginType: this._authRequest.loginType,
      access_token: this._authRequest.access_token,
      deviceToken: this._authRequest.deviceToken,
      mac: this._authRequest.mac,
      deviceModel: this._authRequest.deviceModel,
    };
    try {
      await ModelAccountGame.updateOne({ uid: this.uidGame }, data, {
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
      await ModelAccountGame.updateOne({ uid: this.uidGame }, data, {
        upsert: true,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async close() {
    this.updateSyncDate();
  }

  findAttackIDRandom(fireTarget: Firetarget) {
    const building = fireTarget.planet.building;
    const lvs = _.map(building, 'lv');
    for (const [i, value] of lvs.entries()) {
      if (value) {
        return i + 1;
      }
    }
    return 0;
  }

  async attack(fireTarget: Firetarget) {
    const attackId = this.findAttackIDRandom(fireTarget);
    if (!attackId) {
      return false;
    }
    const d: FireRequest = {
      id: attackId,
      attackType: EFireAttackType.default,
      puid: fireTarget.uid
    }
    const req = await this._weaponService.callFire(d);
    return true;
  }
}
