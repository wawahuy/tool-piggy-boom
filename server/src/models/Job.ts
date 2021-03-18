import { JobsOptions } from "bullmq";

export interface Job {
  name: string;
  data?: any;
  ops?: JobsOptions;
}

export interface JobRunPlayerData {
  uid?: string;
}