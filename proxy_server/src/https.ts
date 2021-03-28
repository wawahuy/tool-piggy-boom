import http from "http";
import net from "net";
import { getHostPortFromString } from "./helpers/get_host_port";

export default class ProxyHTTPSHandler {
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
    return new ProxyHTTPSHandler(request, socket, upgradeHead);
  }

  private handler() {
    const hostPort = getHostPortFromString(this.request.url || "", 443);
    const hostDomain = hostPort.host;
    const port = hostPort.port;

    const proxySocket = new net.Socket();
    proxySocket.connect(port, hostDomain, () => {
        proxySocket.write(this.upgradeHead);
        this.socket.write("HTTP/" + this.request.httpVersion + " 200 Connection established\r\n\r\n");
      }
    );

    proxySocket.on('data', (chunk) => {
      this.socket.write(chunk);
    });

    proxySocket.on('end', () => {
      this.socket.end();
    });

    proxySocket.on('error', () => {
      this.socket.write("HTTP/" + this.request.httpVersion + " 500 Connection error\r\n\r\n");
      this.socket.end();
    });

    this.socket.on('data', (chunk) => {
      proxySocket.write(chunk);
    });

    this.socket.on('end', () => {
      proxySocket.end();
    });

    this.socket.on('error', () => {
      proxySocket.end();
    });
  }
}
