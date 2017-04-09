var io;
io = require('socket.io').listen(4000);
io.sockets.on('connection', function(socket) {
  console.log('client connected');
  // open file

  // at each row...
  socket.broadcast.emit('draw', {
    x: data.x,
    y: data.y,
    type: data.type
  });
});