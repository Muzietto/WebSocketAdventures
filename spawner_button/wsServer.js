Array.prototype.spliceP = function(predicate, length) {
  length = length || 1;
  for (var i=0; i < this.length; i++) {
    if (predicate(this[i])) return this.splice(i,length);
  }
  return [];
}

var uuid = require('node-uuid');
var WebSocketServer = require('ws').Server;
function isClosingMessage(msg) {
  return msg.indexOf('end_job') !== -1;
}

// webSocket server
var wsServer = new WebSocketServer({
  port : 8181
});
console.log('wsServer listening on 8181');
var wsClients = [];

wsServer.on('connection', function (socket) {
  var this_client_uuid = uuid.v4();
  broadcast('client connected: ' + this_client_uuid);

  wsClients.push({uuid: this_client_uuid, socket: socket});
  console.log('client [%s] connected', this_client_uuid);

  socket.on('message', function (message) {
    console.log('message from ws client: ', message);
  });

  socket.on('close', function (code) {
    var announcement = this_client_uuid + ' left!';
    broadcast(announcement);
    console.log('code is ' + code);
    console.log('socket for client [%s] is being closed', this_client_uuid);

    wsClients.spliceP(function(client) {
      client.uuid !== this_client_uuid;
    });
  });
});
wsServer.broadcast = broadcast;
wsServer.clearClients = function() {
  wsClients = [];
}

function broadcast(message) {
  wsClients.forEach(function(client, index) {
    var clientSocket = client.socket;

    if (clientSocket.readyState === 1) {
      console.log('sending to client [%s]: %s', client.uuid, message);
      clientSocket.send(message);
    } else {
      console.log('Can\'t send: readyState for %s is %s', client.uuid, clientSocket.readyState);
    }
  });
}

module.exports = wsServer;