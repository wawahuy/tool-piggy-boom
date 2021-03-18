import { Job as JobBull } from "bullmq";
import moment from "moment";
import AVLTree from "avl";
import { playQueueInstance } from "../director";
import { Job, JobRunPlayerData } from "../../models/Job";
import { createJobRunPlayer, nameJobRunPlayer } from "./run_player_job";
import ModelAccountGame, {
  IAccountGameDocument,
} from "../../models/schema/account_game";
import { FilterQuery } from "mongoose";

export const nameJobFindPlayer = "FIND_PLAYER_JOB";

export const timeRepeatFindJob = 5 * 60 * 1000;

export const timeRangeRunJob = 60 * 60 * 1000;

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

async function buildTestUID() {
  const queue = playQueueInstance.queue;
  const watting = await queue.getWaiting();
  const active = await queue.getActive();
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
  const date = moment().subtract(timeRangeRunJob, "milliseconds").toDate();
  const match: FilterQuery<IAccountGameDocument> = {
    $or: [
      { syncDate: null },
      {
        syncDate: {
          $lte: date,
        },
      },
    ],
  };

  const accounts = await ModelAccountGame.find(match);
  const uidTest = await buildTestUID();

  const results = await Promise.all(
    accounts.map(async (account) => {
      if (!uidTest.find(account.uid)) {
        const jobNew = createJobRunPlayer(account.uid);
        await playQueueInstance.addJob(jobNew);
        return true;
      }
    })
  );

  return `${results.filter((r) => r).length} player added!`;
};
