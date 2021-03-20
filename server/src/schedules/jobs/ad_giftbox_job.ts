import { Job as JobBull } from "bullmq";
import { AuthRequest, ELoginType } from "../../games/models/game_req/auth";
import ModelAccountGame from "../../models/schema/account_game";
import { Job, JobAdGiftboxData, JobRunPlayerData } from "../../models/Job";
import AVLTree from "avl";
import { adGiftBoxQueueInstance } from "../director";
import { RewardAdType } from "../../games/models/game_req/reward";
import Player from "../../games/player";
import ModelGiftboxReport from "../../models/schema/giftbox_report";

export const nameJobAdGiftbox = "AD_GIFTBOX_JOB";

export const createJoAdGiftBox = (
  data: JobAdGiftboxData,
  delay: number = 0
): Job => {
  return {
    name: nameJobAdGiftbox,
    data,
    ops: {
      delay,
    },
  };
};

export function makeKeyDataJobAdGiftbox(
  uid: undefined | string,
  type: RewardAdType
) {
  return uid + "_" + type;
}

export function mapDataJobAdGift(avl: AVLTree<unknown, unknown>, job: JobBull) {
  if (job.name === nameJobAdGiftbox) {
    const data = <JobAdGiftboxData>job.data;
    avl.insert(makeKeyDataJobAdGiftbox(data?.uid, data.type));
  }
}

export async function buildTestAdGiftUID() {
  const queue = adGiftBoxQueueInstance.queue;
  const watting = await queue.getWaiting();
  const active = await queue.getActive();
  const delay = await queue.getDelayed();
  const avl = new AVLTree();

  const mapData = mapDataJobAdGift.bind(null, avl);
  active.map(mapData);
  watting.map(mapData);
  delay.map(mapData);
  return avl;
}

export async function buildTestDelayedAdGiftUID() {
  const queue = adGiftBoxQueueInstance.queue;
  const delay = await queue.getDelayed();
  const avl = new AVLTree();

  const mapData = mapDataJobAdGift.bind(null, avl);
  delay.map(mapData);
  return avl;
}



export const jobAdGiftboxProccess = async (job: JobBull) => {
  const data = <JobAdGiftboxData>job.data;
  if (!data.uid) {
    return Promise.reject(new Error("Job data no uid!"));
  }

  const account = await ModelAccountGame.findOne({ uid: data.uid });
  if (!account) {
    return Promise.reject(new Error("Account dont exists!"));
  }

  const player = Player.getAuthOld(account);
  const type = data.type;
  const reward = await player.getAdGiftBox(type);

  if (!reward) {
    const testDelayed = await buildTestDelayedAdGiftUID();
    if (testDelayed.find(makeKeyDataJobAdGiftbox(data.uid, data.type))) {
      return "Job reward error - no added deplay"
    }

    await adGiftBoxQueueInstance.addJob(
      createJoAdGiftBox(data, type === RewardAdType.adGiftBox1 ? 60000 : 1000)
    );
    return "Job reward error - added deplay!";
  }

  await ModelGiftboxReport.updateOne(
    { uid: data.uid, type: data.type },
    { $inc: { rewardCount: 1 } },
    {
      upsert: true,
    }
  );

  await adGiftBoxQueueInstance.addJob(createJoAdGiftBox(data, reward.delay));
  return reward.reward;
};
