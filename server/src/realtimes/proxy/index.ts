import WebSocket from 'ws';
const wsProxy = new WebSocket.Server({ noServer: true });

wsProxy.on('connection', async (socket) => {
  socket.on('message', async (dataChunk) => {
    socket.send(dataChunk);
  });

  socket.on('close', () => {
  });

  socket.on('error', () => {
  })
});

export default wsProxy;