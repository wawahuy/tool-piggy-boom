import { Job as JobBull } from "bullmq";
import { Job } from "../../models/Job";

export const nameJobRunPlayer = "RUN_PLAYER_JOB";

export const createJobRunPlayer = (uid: string): Job => {
  return {
    name: nameJobRunPlayer,
    data: {
      uid
    },
  }
}

export const jobRunPlayerProccess = async (job: JobBull) => {

}