import { AuthRequest, AuthResponse, ELoginType } from "./models/game_req/auth";
import { GameServiceConfig } from "./models/game_req/game";
import ModelAccountGame, { IAccountGameDocument } from "../models/schema/account_game";
import AuthService from "./services/auth_service";
import BCLogService from "./services/bclog_service";
import GameService from "./services/game_services";
import moment from "moment";
import WeaponService from "./services/weapon_service";
import { Firetarget } from "./models/game/fire";
import _ from "lodash";
import { EFireAttackType, FireRequest } from "./models/game_req/weapon";
import RewardService from "./services/reward_service";
import { RewardAdType } from "./models/game_req/reward";
import { BCLogTypeAdGiftBox } from "./models/game_req/bclog";

export default class Player {
  _gameService: GameService;
  _bcService: BCLogService;
  _weaponService: WeaponService;
  _rewardService: RewardService;

  get noNewAuth() {
    return !this._authData;
  }

  get uidGame() {
    return this._authAccount.uid;
  }

  private constructor(
    private _authAccount: IAccountGameDocument, 
    private _authData?: AuthResponse,
  ) {
    const gameData: GameServiceConfig = {
      uid: this.uidGame,
      skey: this._authAccount.skey,
      mtkey: this._authAccount.mtkey,
      deviceToken: this._authAccount.deviceToken,
    };
    this._gameService = new GameService(gameData);
    this._weaponService = new WeaponService(this._gameService);
    this._rewardService = new RewardService(this._gameService);
    this._bcService = new BCLogService();
  }

  static async create(auth: AuthRequest) {
    const authService = new AuthService();
    const authResponse = await authService.login(auth).catch((res) => null);
    if (!authResponse) {
      return null;
    }
    const account = <IAccountGameDocument>{
      access_token: auth.access_token,
      deviceToken: auth.deviceToken,
      mac: auth.mac,
      deviceModel: auth.deviceModel,
      uid: authResponse.uid,
      mtkey: authResponse.mtkey,
      skey: authResponse.skey,
      loginType: ELoginType.Login
    }
    const instance = new Player(account, authResponse);
    await instance.insertOrUpdateAccount();
    return instance;
  }

  static getAuthOld(account: IAccountGameDocument) {
    const instance = new Player(account);
    return instance;
  }

  private async insertOrUpdateAccount() {
    try {
      await ModelAccountGame.updateOne({ uid: this.uidGame }, this._authAccount, {
        upsert: true,
      });
    } catch (e) {
      console.log(e);
    }
  }

  private async updateSyncDate() {
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

  async getAdGiftBox(type: RewardAdType) {
    await this._rewardService.popAd(type);
    await this._bcService.callUserActionAdGiftBox(this.uidGame, type, BCLogTypeAdGiftBox.POP);
    await new Promise(res => setTimeout(res, 20000));
    await this._bcService.callUserActionAdGiftBox(this.uidGame, type, BCLogTypeAdGiftBox.REWARD);
    const reward = await this._rewardService.rewardAd(type);
    const boxInfo = reward?.data?.giftBoxInfo;
    if (!boxInfo) {
      return null;
    }

    const wattingNext = boxInfo.find((info: any) => info.giftBoxID === type);
    return {
      reward: reward?.data?.reward?.[0]?.type,
      delay: (wattingNext?.giftBoxCDTime || 0) * 1000 + 100
    };
  }
}
