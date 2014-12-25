
var uuid = require('node-uuid');

var WebSocketServer = require('ws').Server

var server = new WebSocketServer({
    port : 8181
  });
  
var clients = [];

server.on('connection', function (socket) {
  var this_client_uuid = uuid.v4();
  clients.push({'uuid':this_client_uuid, 'socket':socket});
  console.log('client [%s] connected', this_client_uuid);

  socket.on('message', function (message) {
    console.log("message from [%s] is [%s]", this_client_uuid, message);
    
    clients.forEach(function(client, index) {
      var clientSocket = client.socket;
      
      if (clientSocket.readyState === 1) {
        console.log('sending to client [%s]: %s', client.uuid, message);
        clientSocket.send(JSON.stringify({
          'uuid': this_client_uuid,
          'message': message
        }));
      } else {
        console.log('clientSocket.readyState is %s', clientSocket.readyState);
      }
    });
  });

  socket.on('close', function (code) {
    console.log("code is " + code);
    console.log('socket for client [%s] is being closed', this_client_uuid);

    clients = clients.filter(function(client) {
      client.uuid !== this_client_uuid;
    });
  });
});
