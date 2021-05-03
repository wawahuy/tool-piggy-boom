import WebSocket from "ws";
import WsClient from "../client";
import { ECommandType } from "./command";
import { EAdminCommandType } from "../admin/command";
import { DataCount, DataCountFrame, NetworkData } from "../../models/proxy_ws";
import { wsAdminManager } from "../admin";
import { EWsAdminGroup, WsProxyBoundData } from "../../models/admin_ws";
import { EWsCommandBase } from "../command";

export default class WsProxyClient extends WsClient<ECommandType> {
  private data!: NetworkData;

  constructor(ws: WebSocket) {
    super(ws);
    this.on(ECommandType.ESTABLISH, this.onEstablish);
    this.on(ECommandType.PING, this.onPing);
    this.on(ECommandType.NET_REQUEST_COUNTER, this.onNetRequest);
    this.on(ECommandType.NET_RESPONSE_COUNTER, this.onNetResponse);
    this.on(ECommandType.NET_SECOND_COUNTER, this.onNetSecond);
    this.on(ECommandType.NET_MINUTE_COUNTER, this.onNetMinute);
    this.on(EWsCommandBase.CLOSE, this.onCloseWs);
  }

  getIp() {
    return this.data?.ip;
  }

  getCountWebsocketConnection() {
    return this.data?.net?.total?.ws?.countRequest;
  }

  getBandwidthAllPerMinute() {
    const data = this.data?.net?.minute;
    return (
      data?.http?.bandwidthRequest +
      data?.http?.bandwidthResponse +
      data?.https?.bandwidthRequest +
      data?.https?.bandwidthResponse +
      data?.ws?.bandwidthResponse
    );
  }

  getProxyData(status: boolean = true) {
    return {
      c: EAdminCommandType.PROXY_DATA,
      d: this.createBoundData(this.data, status),
    };
  }

  private createBoundData<T>(
    data: T,
    status: boolean = true
  ): WsProxyBoundData<T> {
    return {
      ip: this.data.ip || "",
      status,
      data,
    };
  }

  private onCloseWs = () => {
    wsAdminManager.broadcastGroup(
      EWsAdminGroup.PROXY_MGMT,
      this.getProxyData(false)
    );
  };

  private onEstablish = (data: NetworkData) => {
    this.data = data;

    // broadcast admin's
    wsAdminManager.broadcastGroup(
      EWsAdminGroup.PROXY_MGMT,
      this.getProxyData()
    );
  };

  private onPing = () => {
    this.send({
      c: ECommandType.PONG,
    });
  };

  private onNetRequest = (data: DataCountFrame) => {
    const total = this.data?.net?.total;
    if (total) {
      total[data.type] = {
        ...total[data.type],
        countRequest: data.count,
        bandwidthRequest: data.bandwidth,
      };
    }

    // broadcast admin's
    wsAdminManager.broadcastGroup(
      EWsAdminGroup.PROXY_MGMT,
      this.getProxyData()
    );
  };

  private onNetResponse = (data: DataCountFrame) => {
    const total = this.data?.net?.total;
    if (total) {
      total[data.type] = {
        ...total[data.type],
        countResponse: data.count,
        bandwidthResponse: data.bandwidth,
      };
    }

    // broadcast admin's
    wsAdminManager.broadcastGroup(
      EWsAdminGroup.PROXY_MGMT,
      this.getProxyData()
    );
  };

  private onNetSecond = (data: DataCount) => {
    const net = this.data?.net;
    if (net) {
      net.second = data;
    }

    // broadcast admin's
    wsAdminManager.broadcastGroup(
      EWsAdminGroup.PROXY_MGMT,
      this.getProxyData()
    );
  };

  private onNetMinute = (data: DataCount) => {
    const net = this.data?.net;
    if (net) {
      net.minute = data;
    }

    // broadcast admin's
    wsAdminManager.broadcastGroup(
      EWsAdminGroup.PROXY_MGMT,
      this.getProxyData()
    );
  };
}
