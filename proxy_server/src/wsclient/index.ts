import Websocket from "ws";
import { appConfigs } from "../configs/app";
import getIp from "../helpers/get_ip";
import { DataCountFrame, DataCount } from "../models/network_count_director";
import { ESocketCommand } from "../models/socket";
import { NetworkCountDirector } from "./network_count_director";
import TransportData from "./transport_data";

enum EStatusSocket {
  Close,
  Connection,
  Connected,
}

export default class SocketClient {
  private static _instance: SocketClient = new SocketClient();

  static getInstance(): SocketClient {
    return SocketClient._instance;
  }

  private ws!: Websocket;
  private status: EStatusSocket = EStatusSocket.Close;
  private transportData!: TransportData;
  private pingPong!: NodeJS.Timeout | null;

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
    this.ws = new Websocket(
      appConfigs.WS_MGMT + `?token=${appConfigs.SOCKET_PROXY_TOKEN}`
    );
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onerror = this.onError.bind(this);
  }

  private onOpen() {
    console.log("wsclient connected!");
    this.status = EStatusSocket.Connected;
    this.transportData = new TransportData(this.ws);
    this.establish();
    this.setPingPong();
  }

  private onError(e: Websocket.ErrorEvent) {}

  private onClose() {
    console.log("wsclient close!");
    this.clearPingPong();
    this.removeListenNetData();
    this.status = EStatusSocket.Close;
    setTimeout(() => this.connect(), 1000);
  }

  private async establish() {
    const ip = await getIp();
    this.listenNetData();
    this.transportData.send({
      c: ESocketCommand.ESTABLISH,
      d: ip
    });
  }

  private ping() {
    this.transportData.send({
      c: ESocketCommand.PING,
    });
  }

  private setPingPong() {
    this.clearPingPong();
    this.pingPong = setInterval(() => this.ping(), 20000);
  }

  private clearPingPong() {
    if (this.pingPong) {
      clearInterval(this.pingPong);
      this.pingPong = null;
    }
  }

  private listenNetData() {
    const networkCount = NetworkCountDirector.getInstance();
    networkCount.on('request', this.onNetRequestCount);
    networkCount.on('response', this.onNetRequestCount);
    networkCount.on('second', this.onNetSecondCount);
    networkCount.on('minute', this.onNetSecondCount);
  }

  private removeListenNetData() {
    const networkCount = NetworkCountDirector.getInstance();
    networkCount.off('request', this.onNetRequestCount);
    networkCount.off('response', this.onNetRequestCount);
    networkCount.off('second', this.onNetSecondCount);
    networkCount.off('minute', this.onNetSecondCount);
  }

  onNetRequestCount = (data: DataCountFrame) => {
    console.log('request', data);
  }

  onNetResponseCount = (data: DataCountFrame) => {
    console.log('response', data);
  }
  
  onNetSecondCount = (data: DataCount) => {
  }

  onNetMinuteCount = (data: DataCount) => {
  }
}
