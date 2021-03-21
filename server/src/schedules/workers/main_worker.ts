import { Job, Worker } from "bullmq";
import { jobRunProxyProccess, nameJobRunProxy } from "../jobs/run_proxy_job";
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

      case nameJobRunProxy:
        return await jobRunProxyProccess(job);

      default:
        return Promise.reject(new Error("No execute!"));
    }
  }
}