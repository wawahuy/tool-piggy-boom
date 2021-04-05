import http from "http";
import net from "net";
import { getHostPortFromString } from "./helpers/get_host_port";
import { ETypeData } from "./models/network_data";
import { NetworkDataDirector } from "./wsclient/network_data";

export default class ProxyHTTPSHandler {
  private networkData: NetworkDataDirector;

  private constructor(
    private request: http.IncomingMessage,
    private socket: net.Socket,
    private upgradeHead: Buffer
  ) {
    this.networkData = NetworkDataDirector.getInstance();
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
    let bandwidthResponse = 0;
    let bandwidthRequest = 0;

    if (this.networkData.getMaintaince()?.status) {
      this.socket.destroy();
      return;
    }

    const proxySocket = new net.Socket();
    proxySocket.connect(port, hostDomain, () => {
        proxySocket.write(this.upgradeHead);
        this.socket.write("HTTP/" + this.request.httpVersion + " 200 Connection established\r\n\r\n");
      }
    );

    proxySocket.on('data', (chunk) => {
      bandwidthResponse += chunk?.length;
      this.socket.write(chunk);
    });

    proxySocket.on('end', () => {
      this.networkData.response(ETypeData.HTTPS, bandwidthResponse);
      this.socket.end();
    });

    proxySocket.on('error', () => {
      this.socket.write("HTTP/" + this.request.httpVersion + " 500 Connection error\r\n\r\n");
      this.socket.end();
    });

    this.socket.on('data', (chunk) => {
      bandwidthRequest += chunk?.length;
      proxySocket.write(chunk);
    });

    this.socket.on('end', () => {
      this.networkData.request(ETypeData.HTTPS, bandwidthRequest);
      proxySocket.end();
    });

    this.socket.on('error', () => {
      proxySocket.end();
    });
  }
}
