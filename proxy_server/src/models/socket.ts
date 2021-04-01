export enum ESocketCommand {
  ESTABLISH = 'd1',
  PING = 'd2',
  NET_REQUEST_COUNTER = 'd3',
  NET_RESPONSE_COUNTER = 'd4' 
}

export interface SocketData {
  c: ESocketCommand,
  d?: any;
}