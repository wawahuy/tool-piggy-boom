import WebSocket from 'ws';
const wsAdmin = new WebSocket.Server({ noServer: true });

wsAdmin.on('connection', async (socket) => {
  socket.on('message', async (dataChunk) => {
  });

  socket.on('close', () => {
  });

  socket.on('error', () => {
  })
});

export default wsAdmin;