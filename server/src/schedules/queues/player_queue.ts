import { Job, Queue, QueueEvents } from "bullmq";
import jobsConfig from '../../configs/job';


export default class PlayerQueue {
  queue: Queue;
  queueEvent: QueueEvents;

  constructor() {
    const connection = jobsConfig.connection;
    const name = jobsConfig.queuePlayName;
    this.queue = new Queue(name, { connection });
    this.queueEvent = new QueueEvents(name, { connection });
    this.queueEvent.on('completed', this.onJobComplete);
    this.queueEvent.on('progress', this.onJobProgress);
    this.queueEvent.on('failed', this.onJobFailed);
  }

  onJobComplete = (jobId: string) => {
    console.log('complete', jobId);
  }

  onJobProgress = (jobId: string, progress: number | object) => {
    console.log('progress', jobId, progress);
  }

  onJobFailed = (jobId: string) => {
    console.log('failed', jobId);
  }

  addJobs(job: Job[]) {
    this.queue.addBulk(job);
  }
}