import Bull from 'bullmq';
import dbConfigs from '../configs/db';


const connection: Bull.ConnectionOptions = {
  port: (dbConfigs.REDIS_PORT  || -1) as number, 
  host: dbConfigs.REDIS_HOST, 
  password: dbConfigs.REDIS_PWD
};

export default {
  queueMainName: 'main-queue',
  queuePlayName: 'player-queue',
  queueAdGiftBoxName: 'ad-gift-box-queue',
  workerAdGiftboxConcurrency: 20,
  connection
}
