import GameService from "./game_services/game_services";
import BCLogService from "./game_services/bclog_service";
import moment from "moment";
import { AuthRequest, ELoginType, GameServiceConfig } from "./models/game_services";
import AuthService from "./game_services/auth_service";
import ZhuanpanService from "./game_services/zhuanpan_services";

const datalogin: AuthRequest = {
  loginType: ELoginType.Login,
  access_token:
    "EAAYRT55LoKMBAEY7TXedzZBLvfkzBuEsKYS32fzCOxe1yVm9usu7vhmyExJYVSiSbsf0QGeXghfJ9nDuuk1gtv3v29TBeT2nvFMZA43oQUCqLYZC5cHbPIBEgHlbmkIgqUnXLlsKedZAchHdSmeQVqVc4H3ZC7d6bZCm8A9S25cjOUxXH7ZA9V1t6Hq2CAufy8wkmT4PFW6ZAwZDZD",
  deviceToken: "bf8cNVkDLMcpH7T4iruwUg==",
  mac: "T6mpZbaN6U6ZcajNE3RRw",
  deviceModel: "samsung_SM-G975N|25|7.1.2",
};

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
    console.log(data);

    await bcLogService.callUserAction(dataGame.uid, tili);
    if (['steal', 'fire'].includes(type)) {
      break;
    }
    await new Promise(r => setTimeout(r, time + 3000));
  }
})();