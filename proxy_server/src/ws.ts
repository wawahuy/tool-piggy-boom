import http from "http";
import net from "net";
import { URL } from "url";
import httpProxy from "http-proxy";
import { getHostPortFromString } from "./helpers/get_host_port";
import { ungzip } from "node-gzip";

export default class ProxyWSHandler {
  private proxy!: httpProxy;

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
    this.proxy.ws(this.request, this.socket, this.upgradeHead, {
      target: target,
    });
  }

}
