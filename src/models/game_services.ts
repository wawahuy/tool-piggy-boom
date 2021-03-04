export interface GameServiceConfig {
  mtkey: string;
  skey: string;
  uid: string;
  deviceToken: string;
}

export interface GameServiceResponse {
  _t?: number;
  _s?: unknown;
  _d?: {
    ret?: number;
  }
}

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

export interface AuthResponse {
  deviceToken: string,
  uid: string,
  name: string,
  money: string,
  maxTili: number,
  tili: string,
  mtkey: string,
  skey: string,
}

export interface ZhuanpanPlayResponse {
  tili: string;
  rewardType: string;
  time: number;
}