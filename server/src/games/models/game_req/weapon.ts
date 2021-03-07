import { StealTarget } from "../game/steal";

export interface StealResponse {
  siteuid: number,
  count: number,
  maxSteal: number,
  king: boolean,
  money: number,
  isChanged: number,
  nextTarget: StealTarget,
  stealInfo: {
    king: boolean,
    name: string,
    cur_pic: string,
    cur_flag: string,
    fbpic: string,
    picFrameId: number,
    money: number,
    isAgree: number,
    isInstallKakao: number,
    isFriend: boolean
  }[],
  isShare: number
}

export enum EFireAttackType {
  default = 0
}

export interface FireRequest {
  puid: string;
  id: number;
  attackType: number;
}

export interface FireResponse {
  ret: number,
  reward: number,
  tongjiReward: number,
  siteuid: number,
  srcname: string,
  count: number,
  maxFire: number,
  money: number,
  attackPetId: number,
  hasShield: number,
  shield: number
}