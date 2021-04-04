export enum EWsAdminGroup {
  PROXY_MGMT = 'pymgmt'
}

export interface WsProxyBoundData<T> {
  ip: string;
  status: boolean;
  data?: T;
}