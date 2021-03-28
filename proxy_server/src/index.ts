import showNets from './helpers/show_net';
import http from 'http';
import { appConfigs } from './configs/app';
import ProxyHTTPHandler from './http';
import ProxyHTTPSHandler from './https';
import ProxyWSHandler from './ws';

// show detail network's
showNets();

// create server
const server = http.createServer(ProxyHTTPHandler.create);
server.on('upgrade', ProxyWSHandler.create);
server.on('connect', ProxyHTTPSHandler.create);
server.listen(appConfigs.PORT, () => {
  console.log('Proxy start listenning port:', appConfigs.PORT)
});
