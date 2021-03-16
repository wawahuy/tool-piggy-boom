import { Job, Worker } from "bullmq";
import jobsConfig from '../../configs/job';


export default class MainWorker {
  worker: Worker;

  constructor() {
    const connection = jobsConfig.connection;
    const name = jobsConfig.queueMainName;
    this.worker = new Worker(name, this.onProccess, { connection });
  }

  onProccess = async (job: Job) => {
    for(let i=0; i<11; i++) {
      job.updateProgress(i*10);
      await new Promise(res => setTimeout(res, 10000));
    }
    return "done";
  }
}