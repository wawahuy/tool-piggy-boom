import { Queue, QueueEvents, QueueScheduler } from "bullmq";
import { Job } from "../../models/Job";
import jobsConfig from '../../configs/job';


export default class PlayerQueue {
  queue: Queue;
  queueEvent: QueueEvents;
  queueScheduler: QueueScheduler;

  constructor() {
    const connection = jobsConfig.connection;
    const name = jobsConfig.queueMainName;
    this.queue = new Queue(name, { connection });
    this.queueScheduler = new QueueScheduler(name, { connection });
    this.queueEvent = new QueueEvents(name, { connection });
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

  async removeAllJobRepeat() {
    const repeatableJobs = await this.queue.getRepeatableJobs();
    for(let job of repeatableJobs) {
      await this.queue.removeRepeatableByKey(job.key);
    }

    const activeJobs = await this.queue.getActive();
    for(let job of activeJobs) {
      if (job.opts.repeat) {
        await job.remove();
      }
    }
  
    const wattingJobs = await this.queue.getWaiting();
    for(let job of wattingJobs) {
      if (job.opts.repeat) {
        await job.remove();
      }
    }
  }
}