export enum EPushUserCode {
  SUCCESS = 200,
  MSG = -20000
}

export interface PushUserResponse {
  msg: string;
  code: EPushUserCode;
}