import http from 'http';
import { appConfigs } from './configs/app';
import ProxyHTTPHandler from './http';
import ProxyHTTPSHandler from './https';
import ProxyWSHandler from './ws';
import WsClient from './wsclient';
import { bootstrapIpLoad } from './helpers/get_ip';

async function init() {
  // boostrap
  await bootstrapIpLoad();

  // defined
  WsClient.getInstance();

  // create server
  const server = http.createServer(ProxyHTTPHandler.create);
  server.on('upgrade', ProxyWSHandler.create);
  server.on('connect', ProxyHTTPSHandler.create);
  server.listen(appConfigs.PORT, () => {
    console.log('Proxy start listenning port:', appConfigs.PORT)
  });
}

init();