import MainQueue from './queues/main_queue';
import PlayerQueue from './queues/player_queue';
import AdGiftBoxQueue from './queues/ad_gifbox_queue';
import MainWorker from './workers/main_worker';
import PlayerWorker from './workers/player_worker';
import { BullMQAdapter, setQueues } from 'bull-board';
import { jobFindPlayer } from './jobs/find_player_job';
import AdGiftboxWorker from './workers/ad_giftbox_worker';

// create instance queue
export const mainQueueInstance = new MainQueue();
export const playQueueInstance = new PlayerQueue();
export const adGiftBoxQueueInstance = new AdGiftBoxQueue();

// create instance worker
export const mainWorkerInstance = new MainWorker();
export const playWorkerInstance = new PlayerWorker();
export const adGiftboxWorkerInstance = new AdGiftboxWorker();

// init Jobs
export const initJobs = async () => {
  // add repeat job
  await mainQueueInstance.removeAllJobRepeat();
  await mainQueueInstance.addJob(jobFindPlayer);

  setQueues([
    new BullMQAdapter(mainQueueInstance.queue),
    new BullMQAdapter(playQueueInstance.queue),
    new BullMQAdapter(adGiftBoxQueueInstance.queue)
  ])
}


