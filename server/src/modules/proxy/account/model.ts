export enum EPushAccountCode {
  SUCCESS = 200,
  MSG = -20000
}

export interface IPushAccountResponse {
  code?: number;
  msg?: string;
}