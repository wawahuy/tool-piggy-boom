export enum ESocketCommand {
  ESTABLISH = 'd1',
  PING = 'd2',
  PONG = 'd3',
  NET_REQUEST_COUNTER = 'd4',
  NET_RESPONSE_COUNTER = 'd5',
  NET_SECOND_COUNTER = 'd6',
  NET_MINUTE_COUNTER = 'd7',
}

export interface SocketData {
  c: ESocketCommand,
  d?: any;
}