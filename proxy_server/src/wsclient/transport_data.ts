import Websocket from 'ws';
import { ESocketCommand, SocketData } from '../models/socket';
import { EventEmitter } from 'events';

export default  class TransportData extends EventEmitter {
  limitTime: number;
  
  constructor(private ws: Websocket) {
    super();
    this.limitTime = 0;
    this.ws.onmessage = this.onData.bind(this);
  }

  send(data: SocketData) {
    this.ws?.send(JSON.stringify(data));
  }

  private onData(data: Websocket.MessageEvent) {
    const d = data.data.toString();
    try {
      const socketData = <SocketData>JSON.parse(d)
      if (socketData.c) {
        this.emit(socketData.c, socketData.d);
      }
    } catch (e) {
      console.log(e);
    }
  }
}