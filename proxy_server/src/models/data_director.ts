import _ from "lodash";

export interface NetworkCounter {
  countRequest: number;
  countResponse: number;
  bandwidthRequest: number;
  bandwidthResponse: number;
}

export const defaultNetworkCounter: NetworkCounter = {
  countRequest: 0,
  countResponse: 0,
  bandwidthRequest: 0,
  bandwidthResponse: 0,
};

export enum ETypeData {
  HTTP = "http",
  HTTPS = "https",
  WS = "ws",
}

export type TypeData = {
  [key in ETypeData]: NetworkCounter;
};

export const defaultData: TypeData = {
  [ETypeData.HTTP]: _.cloneDeep(defaultNetworkCounter),
  [ETypeData.HTTPS]: _.cloneDeep(defaultNetworkCounter),
  [ETypeData.WS]: _.cloneDeep(defaultNetworkCounter),
};


export interface IDataAll {
  total: TypeData;
  second: TypeData;
  minute: TypeData;
}