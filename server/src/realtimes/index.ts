import http from "http";
import net from "net";
import WebSocket from "ws";
import appConfigs from "../configs/app";
import wsAdmin from "./admin";
import { wsAdminMiddleware } from "../middlewares";

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

  switch (request.url) {
    case appConfigs.WS_ADMIN:
      return wsAdminMiddleware(request, <any>socket, nextWebsocket(wsAdmin));
  }
}
