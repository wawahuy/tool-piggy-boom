import moment from "moment";
import fs from "fs";
import path from "path";
import * as _ from "lodash";
import { AuthRequest, ELoginType, EGameStatus } from "./games/models/game_req/auth";
import AuthService from "./games/services/auth_service";
import { GameServiceConfig } from "./games/models/game_req/game";
import GameService from "./games/services/game_services";
import BCLogService from "./games/services/bclog_service";
import ZhuanpanService from "./games/services/zhuanpan_services";
import { EZhuanpanPlayRewardType } from "./games/models/game_req/zhuanpan";
import WeaponService from "./games/services/weapon_service";
import { EFireAttackType, FireRequest } from "./games/models/game_req/weapon";
import { Firetarget } from "./games/models/game/fire";

const datalogin: AuthRequest = {
  loginType: ELoginType.Login,
  access_token:
    "EAAYRT55LoKMBAEY7TXedzZBLvfkzBuEsKYS32fzCOxe1yVm9usu7vhmyExJYVSiSbsf0QGeXghfJ9nDuuk1gtv3v29TBeT2nvFMZA43oQUCqLYZC5cHbPIBEgHlbmkIgqUnXLlsKedZAchHdSmeQVqVc4H3ZC7d6bZCm8A9S25cjOUxXH7ZA9V1t6Hq2CAufy8wkmT4PFW6ZAwZDZD",
  deviceToken: "bf8cNVkDLMcpH7T4iruwUg==",
  mac: "T6mpZbaN6U6ZcajNE3RRw",
  deviceModel: "samsung_SM-G975N|25|7.1.2",
};


async function attack(weaponService: WeaponService, fireTarget: Firetarget) {
  console.log('attack');
  const building = fireTarget.planet.building;
  const attackID = (() => {
    const lvs = _.map(building, 'lv');
    for (const [i, value] of lvs.entries()) {
      if (value) {
        return i + 1;
      }
    }
    return 0;
  })();
  if (!attackID) {
    console.log('no attack ids!');
    return false;
  }
  const d: FireRequest = {
    id: attackID,
    attackType: EFireAttackType.default,
    puid: fireTarget.uid
  }
  const req = await weaponService.callFire(d);
  console.log('attach reward', req?.reward);
  return true;
}

async function steal(weaponService: WeaponService) {
  console.log('steal');
  const t = await weaponService.callSteal(0); 
  console.log('steal money', t?.money);
  console.log('next money', t?.nextTarget?.money);
}

(async () => {
  const authService = new AuthService();
  const dataLogin = await authService.login(datalogin);
  if (!dataLogin?.deviceToken || !dataLogin.mtkey || !dataLogin.skey || !dataLogin.uid) {
    return;
  }

  const dataGame: GameServiceConfig = {
    deviceToken: dataLogin.deviceToken,
    mtkey: dataLogin.mtkey,
    skey: dataLogin.skey,
    uid: dataLogin.uid
  }
  const gameService = new GameService(dataGame);
  const bcLogService = new BCLogService();
  const zhuanpanService = new ZhuanpanService(gameService);
  const weaponService = new WeaponService(gameService);

  if (dataLogin.status === EGameStatus.fire) {
    console.log('re attack');
    await attack(weaponService, dataLogin.fireTarget);
  }

  if (dataLogin.status === EGameStatus.steal) {
    console.log('re steal');
    await steal(weaponService);
  }

  let tili = 1;
  while(tili) {
    let data = await zhuanpanService.callPlay(tili);
    if (!data) {
      console.log('play result null!');
      await new Promise(r => setTimeout(r, 1000));
      continue;
    }

    let type = data.rewardType;
    let time = data.time;
    console.log(type, data.time, data.tili);

    await bcLogService.callUserAction(dataGame.uid, tili);

    switch (type) {
      case EZhuanpanPlayRewardType.fire:
        await new Promise(r => setTimeout(r, 1000));
        await attack(weaponService, data.fireTarget);
        break;
      
      case EZhuanpanPlayRewardType.steal:
        await new Promise(r => setTimeout(r, 1000));
        await steal(weaponService);
        break;
    }

    await new Promise(r => setTimeout(r, time + 3000));
  }
})();