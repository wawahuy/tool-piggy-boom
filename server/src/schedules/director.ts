import MainQueue from './queues/main_queue';
import PlayerQueue from './queues/player_queue';
import AdGiftBoxQueue from './queues/ad_gifbox_queue';
import MainWorker from './workers/main_worker';
import PlayerWorker from './workers/player_worker';
import { BullMQAdapter, setQueues } from 'bull-board';
import { jobFindPlayer } from './jobs/find_player_job';
import AdGiftboxWorker from './workers/ad_giftbox_worker';
import HarvestGoldQueue from './queues/harvest_gold_queue';
import HarvestGoldWorker from './workers/harvest_gold_worker';

// create instance queue
export const mainQueueInstance = new MainQueue();
export const playQueueInstance = new PlayerQueue();
export const adGiftBoxQueueInstance = new AdGiftBoxQueue();
export const harvestGoldQueueInstance = new HarvestGoldQueue();

// create instance worker
export const mainWorkerInstance = new MainWorker();
export const playWorkerInstance = new PlayerWorker();
export const adGiftboxWorkerInstance = new AdGiftboxWorker();
export const harvestGoldWorkerInstance = new HarvestGoldWorker();

// init Jobs
export const initJobs = async () => {
  // add repeat job
  await mainQueueInstance.removeAllJobRepeat();
  await mainQueueInstance.addJob(jobFindPlayer);

  setQueues([
    new BullMQAdapter(mainQueueInstance.queue),
    new BullMQAdapter(playQueueInstance.queue),
    new BullMQAdapter(adGiftBoxQueueInstance.queue),
    new BullMQAdapter(harvestGoldQueueInstance.queue),
  ])
}


