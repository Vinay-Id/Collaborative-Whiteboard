const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer();
const io = new Server(server);
io.on('connection', (socket) => {
  console.log('New user connected');
  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', data);
  });
  socket.on('disconnect', () => {
    console.log('User exited');
  });
});
const PORT = 5001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
