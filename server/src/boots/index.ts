import http from 'http';
import appConfigs from '../configs/app';
import expressApp from './express';
import initMongo from './mongo';
import initJobs from './job';
import { logger } from '../helpers/logger';
import transportWebsocket from '../realtimes';

const server = http.createServer(expressApp);

server.on('error', (e: Error) => {
  logger.error(e.stack?.toString());
});

server.on('listening', () => {
  logger.info("Express listenning - port: " + appConfigs.APP_PORT)
});

server.on('upgrade', transportWebsocket);

server.listen(appConfigs.APP_PORT, "0.0.0.0");

initMongo();

initJobs();
