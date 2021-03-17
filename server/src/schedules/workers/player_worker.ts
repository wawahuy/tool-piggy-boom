import { Job, Worker } from "bullmq";
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
      default:
        return Promise.reject(new Error("No execute!"));
    }
  }
}