import { JobsOptions } from "bullmq";
import { RewardAdType } from '../games/models/game_req/reward';

export interface Job {
  name: string;
  data?: any;
  ops?: JobsOptions;
}

export interface JobRunPlayerData {
  uid?: string;
}

export interface JobAdGiftboxData {
  uid?: string;
  type: RewardAdType
}

export interface JobHarvestGoldData {
  uid?: string;
}