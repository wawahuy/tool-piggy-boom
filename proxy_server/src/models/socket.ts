export enum ESocketCommand {
  ESTABLISH = 'establish',
}

export interface SocketData {
  command: ESocketCommand,
  data: any;
}