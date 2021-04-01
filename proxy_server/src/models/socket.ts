export enum ESocketCommand {
  ESTABLISH = 'establish',
  PING = 'ping',
  PONG = 'pong'
}

export interface SocketData {
  command: ESocketCommand,
  data?: any;
}