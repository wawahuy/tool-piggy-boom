import http from "http";
import net from "net";
import { URL } from "url";
import httpProxy from "http-proxy";
import Server from "http-proxy";
import { NetworkDataDirector } from "./wsclient/network_data";
import { ETypeData } from "./models/network_data";

export default class ProxyWSHandler {
  private proxy!: httpProxy;
  private networkCounter = NetworkDataDirector.getInstance();

  private get urlReq() {
    if (!this.request.url) {
      return null;
    }
    const baseURL = "http://" + this.request.headers.host + "/";
    const url = new URL(this.request.url, baseURL);
    return url;
  }

  private constructor(
    private request: http.IncomingMessage,
    private socket: net.Socket,
    private upgradeHead: Buffer
  ) {
    this.handler();
  }

  static create(
    request: http.IncomingMessage,
    socket: net.Socket,
    upgradeHead: Buffer
  ) {
    return new ProxyWSHandler(request, socket, upgradeHead);
  }

  private handler() {
    const url = this.urlReq;
    if (!url) {
      return;
    }
    const target = url.protocol + "//" + url.host;
    this.proxy = httpProxy.createProxyServer({});
    this.proxy.on('proxyReqWs', this.onProxyReqWs.bind(this));
    this.proxy.ws(this.request, this.socket, this.upgradeHead, {
      target: target,
    });
  }

  private onProxyReqWs(
    proxyReq: http.ClientRequest,
    req: http.IncomingMessage,
    socket: net.Socket,
    options: Server.ServerOptions,
    head: any
  ) {
    proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
      this.networkCounter.request(ETypeData.WS, 0, 1);

      proxySocket.on('close', () => {
        this.networkCounter.request(ETypeData.WS, 0, -1);
      })

      proxySocket.on('data', (chunk) => {
        this.networkCounter.response(ETypeData.WS, chunk?.byteLength, 0);
      })
    });
  }
}
