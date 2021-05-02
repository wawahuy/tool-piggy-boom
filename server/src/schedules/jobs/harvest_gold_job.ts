import { Job as JobBull } from "bullmq";
import ModelAccountGame from "../../models/schema/account_game";
import { Job, JobHarvestGoldData } from "../../models/Job";
import AVLTree from "avl";
import Player from "../../games/player";
import { harvestGoldQueueInstance } from "../director";
import ModelHarvestGoldReport from "../../models/schema/harvest_gold_report";

export const nameJobHarvestGold = "HARVEST_GOLD_JOB";

export const createJobHavestGold = (
  data: JobHarvestGoldData,
  delay: number = 0
): Job => {
  return {
    name: nameJobHarvestGold,
    data,
    ops: {
      delay,
    },
  };
};

export function mapDataJobHarvestGold(avl: AVLTree<unknown, unknown>, job: JobBull) {
  if (job.name === nameJobHarvestGold) {
    const data = <JobHarvestGoldData>job.data;
    avl.insert(data?.uid);
  }
}

export async function buildTestHarvestGoldUID() {
  const queue = harvestGoldQueueInstance.queue;
  const watting = await queue.getWaiting(0, await queue.getWaitingCount());
  const active = await queue.getActive(0, await queue.getActiveCount());
  const delay = await queue.getDelayed(0, await queue.getDelayedCount());
  const avl = new AVLTree();

  const mapData = mapDataJobHarvestGold.bind(null, avl);
  active.map(mapData);
  watting.map(mapData);
  delay.map(mapData);
  return avl;
}

export async function buildTestDelayedHarvestGoldUID() {
  const queue = harvestGoldQueueInstance.queue;
  const delay = await queue.getDelayed(0, await queue.getDelayedCount());
  const avl = new AVLTree();

  const mapData = mapDataJobHarvestGold.bind(null, avl);
  delay.map(mapData);
  return avl;
}



export const jobHarvestGoldProccess = async (job: JobBull) => {
  const data = <JobHarvestGoldData>job.data;
  if (!data.uid) {
    return Promise.reject(new Error("Job data no uid!"));
  }

  const account = await ModelAccountGame.findOne({ uid: data.uid });
  if (!account) {
    return Promise.reject(new Error("Account dont exists!"));
  }

  const player = Player.getAuthOld(account);
  const reward = await player.harvestGold();

  if (!reward) {
    const testDelayed = await buildTestDelayedHarvestGoldUID();
    if (testDelayed.find(data.uid)) {
      return "Job reward error - no added delay"
    }

    await harvestGoldQueueInstance.addJob(
      createJobHavestGold(data, 60000)
    );
    return "Job reward error - added delay!";
  }

  await ModelHarvestGoldReport.updateOne(
    { uid: data.uid },
    { $inc: { rewardCount: 1 } },
    {
      upsert: true,
    }
  );

  await harvestGoldQueueInstance.addJob(createJobHavestGold(data, reward.delay));
  return reward.reward;
};
