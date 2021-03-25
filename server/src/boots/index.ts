import http from 'http';
import appConfigs from '../configs/app';
import expressApp from './express';
import initMongo from './mongo';
import initJobs from './job';
import wss from './ws';
import { wsMiddleware } from "../middlewares";
import { logger } from '../helpers/logger';

const server = http.createServer(expressApp);

server.on('error', (e: Error) => {
  logger.error(e.stack?.toString());
});

server.on('listening', () => {
  logger.info("Express listenning - port: " + appConfigs.APP_PORT)
});

server.on('upgrade', function upgrade(request, socket, head) {
  if (request.url === appConfigs.WS) {
    const next = () => {
      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
      });
    };
    wsMiddleware(request, socket, next);
  }
});

server.listen(appConfigs.APP_PORT, "0.0.0.0");

initMongo();

initJobs();
