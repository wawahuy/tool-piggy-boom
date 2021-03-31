import Websocket from 'ws';
import { appConfigs } from '../configs/app';
import getIp from '../helpers/get_ip';
import { ESocketCommand } from '../models/socket';
import TransportData from './transport_data';

enum EStatusSocket {
  Close,
  Connection,
  Connected
}

export default class SocketClient {
  private static _instance: SocketClient = new SocketClient;
  
  static getInstance(): SocketClient {
    return SocketClient._instance;
  }
  
  private ws!: Websocket;
  private status: EStatusSocket = EStatusSocket.Close;
  private transportData!: TransportData;

  get transport() {
    return this.transportData;
  }

  constructor() {
    this.connect();
  }

  connect() {
    if (this.status !== EStatusSocket.Close) {
      return;
    }
    this.status = EStatusSocket.Connection;
    this.ws = new Websocket(appConfigs.WS_MGMT + `?token=${appConfigs.SOCKET_PROXY_TOKEN}`);
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onerror = this.onError.bind(this);
  }

  onOpen() {
    console.log('wsclient connected!')
    this.status = EStatusSocket.Connected;
    this.transportData = new TransportData(this.ws);
    this.establish();
  }

  private async establish() {
    this.transportData.send({
      command: ESocketCommand.ESTABLISH,
      data: await getIp()
    })
    this.transportData.on(ESocketCommand.ESTABLISH.toString(), (data) => {
      console.log(data);
    })
  }

  onError(e: Websocket.ErrorEvent) {
  }

  onClose() {
    console.log('wsclient close!');
    this.status = EStatusSocket.Close;
    setTimeout(() => this.connect(), 1000);
  }
}