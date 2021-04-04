import WsCommand, { EWsCommandBase } from "../command";
import WebSocket from "ws";
import WsClient from "../client";
import { EAdminCommandType } from "./command";
import { wsProxyManager } from "../proxy";
import { EWsAdminGroup } from "../../models/admin_ws";

export default class WsAdminClient extends WsClient<EAdminCommandType> {
  constructor(ws: WebSocket) {
    super(ws);
    this.connect();
    this.on(EWsCommandBase.JOIN_GROUP, this.onJoinGroup);
  }

  private connect() {
  }

  private onJoinGroup = (name: EWsAdminGroup) => {
    switch (name) {
      case EWsAdminGroup.PROXY_MGMT:
        this.onJoinGroupProxy();
    }
  }

  private onJoinGroupProxy() {
    const clients = wsProxyManager.getClients();
    for (let id in clients) {
      const client = clients[id];
      this.send(client.getProxyData());
    }
  }
}