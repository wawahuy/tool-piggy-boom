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