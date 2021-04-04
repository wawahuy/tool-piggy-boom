import WebSocket from 'ws';
import ClientManager from '../client_manager';
import WsAdminClient from './client';
import { EAdminCommandType } from './command';

/**
 * Server
 * 
 */
const wsAdmin = new WebSocket.Server({ noServer: true });

/**
 * Manager
 * 
 */
export const wsAdminManager = new ClientManager<EAdminCommandType, WsAdminClient>();

/**
 * Connection
 * 
 */
wsAdmin.on('connection', (ws: WebSocket) => {
  const client = new WsAdminClient(ws);
  wsAdminManager.connection(client);
});

export default wsAdmin;