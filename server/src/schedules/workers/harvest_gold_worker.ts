import { Job, Worker } from "bullmq";
import jobsConfig from "../../configs/job";
import { jobHarvestGoldProccess, nameJobHarvestGold } from "../jobs/harvest_gold_job";

export default class HarvestGoldWorker {
  worker: Worker;

  constructor() {
    const connection = jobsConfig.connection;
    const name = jobsConfig.queueHarvestGoldName;
    this.worker = new Worker(name, this.onProccess, {
      connection,
      concurrency: jobsConfig.workerHarvestGoldConcurrency,
    });
  }

  onProccess = async (job: Job) => {
    switch (job.name) {
      case nameJobHarvestGold:
        return await jobHarvestGoldProccess(job);

      default:
        return Promise.reject(new Error("No execute!"));
    }
  };
}
