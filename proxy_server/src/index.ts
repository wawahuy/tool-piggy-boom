import http from 'http';
import { appConfigs } from './configs/app';
import getIp from './helpers/get_ip';
import ProxyHTTPHandler from './http';
import ProxyHTTPSHandler from './https';
import ProxyWSHandler from './ws';
import WsClient from './wsclient';

WsClient.getInstance();

// test
getIp().then(r => console.log(r)).catch(e => null);

// create server
const server = http.createServer(ProxyHTTPHandler.create);
server.on('upgrade', ProxyWSHandler.create);
server.on('connect', ProxyHTTPSHandler.create);
server.listen(appConfigs.PORT, () => {
  console.log('Proxy start listenning port:', appConfigs.PORT)
});
