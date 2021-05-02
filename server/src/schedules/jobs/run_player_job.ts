import { Job as JobBull } from "bullmq";
import { AuthRequest, ELoginType } from "../../games/models/game_req/auth";
import ModelAccountGame from "../../models/schema/account_game";
import { Job, JobAdGiftboxData, JobRunPlayerData } from "../../models/Job";
import { adGiftBoxQueueInstance, harvestGoldQueueInstance } from "../director";
import AVLTree from "avl";
import {
  buildTestAdGiftUID,
  createJoAdGiftBox,
  makeKeyDataJobAdGiftbox,
  nameJobAdGiftbox,
} from "./ad_giftbox_job";
import { RewardAdType } from "../../games/models/game_req/reward";
import {
  buildTestHarvestGoldUID,
  createJobHavestGold,
} from "./harvest_gold_job";

export const nameJobRunPlayer = "RUN_PLAYER_JOB";

export const createJobRunPlayer = (uid: string): Job => {
  return {
    name: nameJobRunPlayer,
    data: {
      uid,
    } as JobRunPlayerData,
    ops: {
      removeOnComplete: true
    }
  };
};

export const jobRunPlayerProccess = async (job: JobBull) => {
  const data = <JobRunPlayerData>job.data;
  if (!data.uid) {
    return Promise.reject(new Error("Job data no uid!"));
  }

  const account = await ModelAccountGame.findOne({ uid: data.uid });
  if (!account) {
    return Promise.reject(new Error("Account dont exists!"));
  }

  // check giftbox rewards
  const uidAdGiftTest1 = await buildTestAdGiftUID();
  if (
    !uidAdGiftTest1.find(
      makeKeyDataJobAdGiftbox(account?.uid, RewardAdType.adGiftBox1)
    )
  ) {
    await adGiftBoxQueueInstance.addJob(
      createJoAdGiftBox({
        uid: account.uid,
        type: RewardAdType.adGiftBox1,
      })
    );
  }

  const uidAdGiftTest2 = await buildTestAdGiftUID();
  if (
    !uidAdGiftTest2.find(
      makeKeyDataJobAdGiftbox(account?.uid, RewardAdType.adGiftBox2)
    )
  ) {
    await adGiftBoxQueueInstance.addJob(
      createJoAdGiftBox({
        uid: account.uid,
        type: RewardAdType.adGiftBox2,
      })
    );
  }

  // check harvest gold
  const uidHarvestGoldTest = await buildTestHarvestGoldUID();
  if (!uidHarvestGoldTest.find(account?.uid)) {
    await harvestGoldQueueInstance.addJob(
      createJobHavestGold({
        uid: account.uid,
      })
    );
  }
  
  return "Good jobs!";
};
