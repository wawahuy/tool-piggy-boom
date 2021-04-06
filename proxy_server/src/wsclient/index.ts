import { DebouncedFunc } from "lodash";
import Websocket from "ws";
import { appConfigs } from "../configs/app";
import getIp from "../helpers/get_ip";
import { DataCountFrame, DataCount } from "../models/network_data";
import { ESocketCommand, SocketData } from "../models/socket";
import { NetworkDataDirector } from "./network_data";
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
  private networkData = NetworkDataDirector.getInstance();
  private sendLimitRequest!: DebouncedFunc<(data: SocketData) => void>;
  private sendLimitResponse!: DebouncedFunc<(data: SocketData) => void>;

  readonly wsSendLimit: number = 200;

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
    this.sendLimitRequest = this.transportData.buildSendLimit(this.wsSendLimit);
    this.sendLimitResponse = this.transportData.buildSendLimit(this.wsSendLimit);
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

  private establish() {
    const ip = getIp();
    this.listenNetData();
    this.transportData.send({
      c: ESocketCommand.ESTABLISH,
      d: {
        ip: ip + ':' + appConfigs.PORT,
        ...this.networkData.getAll()
      }
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
    const networkCount = NetworkDataDirector.getInstance();
    networkCount.on('request', this.onNetRequestCount);
    networkCount.on('response', this.onNetResponseCount);
    networkCount.on('second', this.onNetSecondCount);
    networkCount.on('minute', this.onNetMinuteCount);
  }

  private removeListenNetData() {
    const networkCount = NetworkDataDirector.getInstance();
    networkCount.off('request', this.onNetRequestCount);
    networkCount.off('response', this.onNetResponseCount);
    networkCount.off('second', this.onNetSecondCount);
    networkCount.off('minute', this.onNetMinuteCount);
  }

  onNetRequestCount = (data: DataCountFrame) => {
    this.sendLimitRequest({
      c: ESocketCommand.NET_REQUEST_COUNTER,
      d: data
    })    
  }

  onNetResponseCount = (data: DataCountFrame) => {
    this.sendLimitResponse({
      c: ESocketCommand.NET_RESPONSE_COUNTER,
      d: data
    })    
  }
  
  onNetSecondCount = (data: DataCount) => {
    this.transportData.send({
      c: ESocketCommand.NET_SECOND_COUNTER,
      d: data
    })
  }

  onNetMinuteCount = (data: DataCount) => {
    this.transportData.send({
      c: ESocketCommand.NET_MINUTE_COUNTER,
      d: data
    })

  }
}
