import { Queue, QueueEvents, QueueScheduler } from "bullmq";
import { Job } from "../../models/Job";
import jobsConfig from '../../configs/job';


export default class HarvestGoldQueue {
  queue: Queue;
  queueEvent: QueueEvents;
  queueScheduler: QueueScheduler;

  constructor() {
    const connection = jobsConfig.connection;
    const name = jobsConfig.queueHarvestGoldName;
    this.queue = new Queue(name, { connection });
    this.queueEvent = new QueueEvents(name, { connection });
    this.queueScheduler = new QueueScheduler(name, { connection });
    this.queueEvent.on('completed', this.onJobComplete);
    this.queueEvent.on('progress', this.onJobProgress);
    this.queueEvent.on('failed', this.onJobFailed);
  }

  onJobComplete = (jobId: string) => {
    // console.log('complete', jobId);
  }

  onJobProgress = (jobId: string, progress: number | object) => {
    // console.log('progress', jobId, progress);
  }

  onJobFailed = (jobId: string) => {
    // console.log('failed', jobId);
  }

  async addJob(job: Job) {
    await this.queue.add(job.name, job.data, job.ops);
  }
}