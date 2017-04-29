
Array.prototype.spliceP = function(predicate, length) {
  length = length || 1;
  for (var i=0;i<this.length;i++) {
    if (predicate(this[i])) return this.splice(i,length);
  }
  return [];
}

function broadcast(sender_nickname, message) {
  clients.forEach(function(client, index) {
    var clientSocket = client.socket;
    
    if (clientSocket.readyState === 1) {
      console.log('sending to client [%s]: %s', client.nickname, message);
      clientSocket.send(JSON.stringify({
        'nickname': sender_nickname,
        'message': message
      }));
    } else {
      console.log('Can\'t send: readyState for %s is %s', client.nickname, clientSocket.readyState);
    }
  });
}
  
var clients = [];

if (typeof module !== 'undefined') {

  var uuid = require('node-uuid');

  var WebSocketServer = require('ws').Server;

  var server = new WebSocketServer({
    port : 8181
  });

  server.on('connection', function (socket) {
    var this_client_uuid = uuid.v4();
    var this_client_nickname = this_client_uuid.substr(0,8);
    var announcement = this_client_nickname + ' joined the chat!';
    broadcast('From the Server', announcement);

    clients.push({'uuid':this_client_uuid, 'socket':socket, 'nickname': this_client_nickname});
    console.log('client [%s] connected', this_client_nickname);

    socket.on('message', function (message) {
      console.log("message from [%s] is [%s]", this_client_nickname, message);
      
      if (message.indexOf('/nick') === 0) {
        var nick_splitted = message.split(' ');
        if (nick_splitted.length >= 2) {
          nick_splitted.splice(0,1); // side effect
          var old_nick = this_client_nickname;
          this_client_nickname = nick_splitted.join(' ');
          
          message = 'Client ' + old_nick + ' changed to ' + this_client_nickname;
        }
      }
      broadcast(this_client_nickname, message);
    });

    socket.on('close', function (code) {
      var announcement = this_client_nickname + ' left the chat!';
      broadcast('From the Server', announcement);
      console.log("code is " + code);
      console.log('socket for client [%s] is being closed', this_client_nickname);

      clients.spliceP(function(client) {
        client.uuid !== this_client_uuid;
      });
    });
  });
}