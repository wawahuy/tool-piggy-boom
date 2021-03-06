import { Firetarget } from "../game/fire";
import { Planet } from "../game/planet";

export enum EZhuanpanPlayRewardType {
  money = 'money',
  steal = 'steal', 
  fire = 'fire'  
}

export interface ZhuanpanPlayResponse {
  tili: string;
  time: number;
  rewardType: EZhuanpanPlayRewardType;
  fireTarget: Firetarget;
  stealTarget: {
    planet: Planet
  }[];
}

