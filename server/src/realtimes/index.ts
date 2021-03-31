import http from "http";
import net from "net";
import WebSocket from "ws";
import appConfigs from "../configs/app";
import wsAdmin from "./admin";
import { wsAdminMiddleware, wsProxyMiddleware } from "../middlewares";
import wsProxy from "./proxy";
import Url from "url";

export default function transportWebsocket(
  request: http.IncomingMessage,
  socket: net.Socket,
  upgradeHead: Buffer
) {
  const nextWebsocket = (wss: WebSocket.Server) => {
    return () => {
      wss.handleUpgrade(request, socket, upgradeHead, function done(ws) {
        wss.emit('connection', ws, request);
      });
    };
  }

  if (!request.url) {
    socket.destroy();
    return;
  }

  const url = Url.parse(request.url);
  switch (url.pathname) {
    case appConfigs.WS_ADMIN:
      return wsAdminMiddleware(request, <any>socket, nextWebsocket(wsAdmin));

    case appConfigs.WS_PROXY:
      return wsProxyMiddleware(request, <any>socket, nextWebsocket(wsProxy));
  }

  socket.destroy();
}
