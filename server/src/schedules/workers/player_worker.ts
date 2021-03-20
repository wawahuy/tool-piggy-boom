import { Job, Worker } from "bullmq";
import { jobRunPlayerProccess, nameJobRunPlayer } from "../../schedules/jobs/run_player_job";
import jobsConfig from '../../configs/job';


export default class PlayerWorker {
  worker: Worker;

  constructor() {
    const connection = jobsConfig.connection;
    const name = jobsConfig.queuePlayName;
    this.worker = new Worker(name, this.onProccess, { connection });
  }

  onProccess = async (job: Job) => {
    switch (job.name) {
      case nameJobRunPlayer:
        return await jobRunPlayerProccess(job);

      default:
        return Promise.reject(new Error("No execute!"));
    }
  }
}