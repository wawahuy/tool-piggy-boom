export interface NetworkCounter {
  countRequest: number;
  countResponse: number;
  bandwidthRequest: number;
  bandwidthResponse: number;
}

export enum ETypeData {
  HTTP = "http",
  HTTPS = "https",
  WS = "ws",
}

export type DataCount = {
  [key in ETypeData]: NetworkCounter;
};

export interface NetworkData {
  ip?: string;
  net: {
    total: DataCount;
    second: DataCount;
    minute: DataCount;
  },
  maintance: MaintanceData;
  timeLimitCommand: number;
}

export interface DataCountFrame {
  type: ETypeData;
  count: number;
  bandwidth: number;
}

export interface MaintanceData {
  status?: boolean;
  msg?: string;
}