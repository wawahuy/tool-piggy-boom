import { Job as JobBull } from "bullmq";
import moment from "moment";
import AVLTree from "avl";
import { mainQueueInstance, playQueueInstance } from "../director";
import { Job, JobRunPlayerData } from "../../models/Job";
import { createJobRunPlayer, nameJobRunPlayer } from "./run_player_job";
import ModelAccountGame from "../../models/schema/account_game";
import appConfigs from '../../configs/app';
import ModelIPProxyConfig from "../../models/schema/ip_proxy_config";

export const nameJobFindPlayer = "FIND_PLAYER_JOB";

export const timeRepeatFindJob = appConfigs.IS_DEVELOPMENT ? 1000 : 30 * 1000;

export const jobFindPlayer: Job = {
  name: nameJobFindPlayer,
  data: null,
  ops: {
    repeat: {
      every: timeRepeatFindJob,
      count: 0,
    },
    attempts: 0,
  },
};

async function buildTestRunPlayerUID() {
  const queue = playQueueInstance.queue;
  const watting = await queue.getWaiting(0, await queue.getWaitingCount());
  const active = await queue.getActive(0, await queue.getActiveCount());
  const avl = new AVLTree();

  active.map(job => {
    if (job.name === nameJobRunPlayer) {
      avl.insert((<JobRunPlayerData>job.data).uid)
    }
  })

  watting.map(job => {
    if (job.name === nameJobRunPlayer) {
      avl.insert((<JobRunPlayerData>job.data).uid)
    }
  })

  return avl;
}

export const jobFindPlayerProccess = async (job: JobBull) => {
  const accounts = await ModelAccountGame.find({});
  for(let account of accounts) {
    const uidTest = await buildTestRunPlayerUID();
    if (!uidTest.find(account.uid)) {
      const jobNew = createJobRunPlayer(account.uid);
      await playQueueInstance.addJob(jobNew);
    }
  }

  return `Good jobs`;
};
