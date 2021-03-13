import { Queue, Worker } from 'bullmq';
import { BullMQAdapter, setQueues } from 'bull-board';
import jobConfigs from '../configs/job';


function initJobs() {
  const connection = jobConfigs.connection;
  const queue = new Queue(jobConfigs.queueMainName, { connection });
  
  const worker = new Worker(jobConfigs.queueMainName, async job => {
    console.log(job.data);
  }, { connection });

  worker.on('completed', (job) => {
    console.log(`${job.id} has completed!`);
  });

  worker.on('failed', (job, err) => {
      console.log(`${job.id} has failed with ${err.message}`);
  });


  // queue.add('cars', {
  //   jobId: 'shouldbecreatedonlyonce',
  // });

  setQueues([
    new BullMQAdapter(queue),
  ]);
}

export default initJobs;
