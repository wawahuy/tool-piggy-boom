import MainQueue from './queues/main_queue';
import MainWorker from './workers/main_worker';
import { BullMQAdapter, setQueues } from 'bull-board';
import { jobFindPlayer, nameJobFindPlayer } from './jobs/find_player_job';

// create instance queue
export const mainQueueInstance = new MainQueue();

// create instance worker
export const mainWorkerInstance = new MainWorker();

// init Jobs
export const initJobs = async () => {
  // add repeat job
  await mainQueueInstance.removeAllJobRepeat();
  await mainQueueInstance.addJob(jobFindPlayer);

  setQueues([
    new BullMQAdapter(mainQueueInstance.queue)
  ])
}


