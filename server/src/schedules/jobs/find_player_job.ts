import { Job } from "../../models/Job";

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