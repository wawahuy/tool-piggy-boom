import { Job as JobBull } from "bullmq";
import { playQueueInstance } from "../director";
import { Job } from "../../models/Job";
import { createJobRunPlayer } from "./run_player_job";
import ModelAccountGame, { IAccountGameDocument } from "../../models/schema/account_game";
import moment from "moment";
import { FilterQuery } from "mongoose";

export const nameJobFindPlayer = "FIND_PLAYER_JOB";

export const jobFindPlayer: Job = {
  name: nameJobFindPlayer,
  data: null,
  ops: {
    repeat: {
      every: 5 * 60 * 1000,
      count: 0,
    },
  }
}

export const jobFindPlayerProccess = async (job: JobBull) => {
  const date = moment().subtract(1, 'hours').toDate();
  const match: FilterQuery<IAccountGameDocument> = {
    $or: [
      { syncDate: null },
      { 
        syncDate: { 
          $lte: date 
        } 
      }
    ]
  };
  const accounts = await ModelAccountGame.find(match);

  await ModelAccountGame.updateMany(match, { syncDate: moment().toDate() })

  await Promise.all(accounts.map(async account => {
    const job = createJobRunPlayer(account.uid);
    await playQueueInstance.addJob(job);
  }))

  return `${accounts.length} player added!`;
}