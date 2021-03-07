import http from 'http';
import appConfigs from '../configs/app';
import expressApp from './express';
import initMongo from './mongo';
import wss from './ws';

const server = http.createServer(expressApp);

server.listen(
  appConfigs.APP_PORT,
  "0.0.0.0",
  () => {
    console.log("Express listening...", appConfigs.APP_PORT)
  }
)

server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = new URL(request.url).pathname;

  if (pathname === appConfigs.WS) {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  }
});

initMongo();
