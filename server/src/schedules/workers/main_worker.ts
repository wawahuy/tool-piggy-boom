import { Job, Worker } from "bullmq";
import jobsConfig from '../../configs/job';
import { jobFindPlayerProccess, nameJobFindPlayer } from "../jobs/find_player_job";


export default class MainWorker {
  worker: Worker;

  constructor() {
    const connection = jobsConfig.connection;
    const name = jobsConfig.queueMainName;
    this.worker = new Worker(name, this.onProccess, { connection });
  }

  onProccess = async (job: Job) => {
    switch (job.name) {
      case nameJobFindPlayer:
        return await jobFindPlayerProccess(job);

      default:
        return Promise.reject(new Error("No execute!"));
    }
  }
}