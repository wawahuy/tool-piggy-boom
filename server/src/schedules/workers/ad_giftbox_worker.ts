import { Job, Worker } from "bullmq";
import { jobAdGiftboxProccess, nameJobAdGiftbox } from "../jobs/ad_giftbox_job";
import jobsConfig from "../../configs/job";

export default class AdGiftboxWorker {
  worker: Worker;

  constructor() {
    const connection = jobsConfig.connection;
    const name = jobsConfig.queueAdGiftBoxName;
    this.worker = new Worker(name, this.onProccess, {
      connection,
      concurrency: jobsConfig.workerAdGiftboxConcurrency,
    });
  }

  onProccess = async (job: Job) => {
    switch (job.name) {
      case nameJobAdGiftbox:
        return jobAdGiftboxProccess(job);

      default:
        return Promise.reject(new Error("No execute!"));
    }
  };
}
