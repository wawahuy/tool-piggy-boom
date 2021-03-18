import { Firetarget } from "../game/fire";
import { Planet } from "../game/planet";
import { StealTarget } from "../game/steal";

export enum ELoginType {
  Login = 1
}

export interface AuthRequest {
  loginType: ELoginType,
  access_token: string,
  deviceToken: string,
  mac: string,
  deviceModel: string,
}

export enum EGameStatus {
  steal = 'steal',
  fire = 'fire'
}

export interface AuthResponse {
  deviceToken: string,
  uid: string,
  name: string,
  money: string,
  mtkey: string,
  skey: string,
  status: EGameStatus,
  zhuanpan: {
    maxTili: number,
    tili: string,
    stealTarget: {
      isChanged: boolean
    } & StealTarget,
  }
  fireTarget: Firetarget,
  planet: Planet;
}