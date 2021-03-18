import { Job as JobBull } from "bullmq";
import { AuthRequest, ELoginType } from "../../games/models/game_req/auth";
import ModelAccountGame from "../../models/schema/account_game";
import Player from "../../games/player";
import { Job, JobRunPlayerData } from "../../models/Job";

export const nameJobRunPlayer = "RUN_PLAYER_JOB";

export const createJobRunPlayer = (uid: string): Job => {
  return {
    name: nameJobRunPlayer,
    data: {
      uid
    } as JobRunPlayerData,
  }
}

export const jobRunPlayerProccess = async (job: JobBull) => {
  const data = <JobRunPlayerData>job.data;
  if (!data.uid) {
    return Promise.reject(new Error("Job data no uid!"));
  }

  const account = await ModelAccountGame.findOne({ uid: data.uid });
  if (!account) {
    return Promise.reject(new Error("Account dont exists!"));
  }
  
  const authRequest: AuthRequest =  {
    loginType: ELoginType.Login,
    access_token: account.access_token,
    deviceToken: account.deviceToken,
    deviceModel: account.deviceModel,
    mac: account.mac
  }
  const player = await Player.create(authRequest);
  if (!player) {
    return Promise.reject(new Error("Account auth failed!"));
  }

  if (!player.isFullTili) {
    return "Dont play - not full tili!"
  }

  await player.close();
  return "Good jobs!";
}