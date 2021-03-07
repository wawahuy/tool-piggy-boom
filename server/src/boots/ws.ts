import WebSocket from 'ws';
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', async (socket) => {
  socket.on('message', async (dataChunk) => {
  });

  socket.on('close', () => {
  });

  socket.on('error', () => {
  })
});

export default wss;