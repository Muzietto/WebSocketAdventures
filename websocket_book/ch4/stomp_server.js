
Array.prototype.spliceP = function (predicate, length) {
  length = length || 1;
  for (var i = 0; i < this.length; i++) {
    if (predicate(this[i]))
      return this.splice(i, length);
  }
  return [];
}

if (typeof module !== 'undefined') {

  var uuid = require('node-uuid');
  var WebSocketServer = require('ws').Server;
  var server = new WebSocketServer({
      port : 8181,
      handleProtocols: function(protocol, callback) {
        var v10_stomp = protocol[protocol.indexOf('v10.stomp')];
        if (v10_stomp) {
          callback(true, v10_stomp)
          return;
        }
        callback(false);
      }
    });
  var stockUpdater;

  var stocks = {
    "AAPL" : 95.0,
    "MSFT" : 50.0,
    "AMZN" : 300.0,
    "GOOG" : 550.0,
    "YHOO" : 35.0
  }

  //randomStockUpdater();

  server.on('connection', function (socket) {
    var sessionId = uuid.v4();
    socket.on('message', function (message) {
      var frame = Stomp.process_frame(message);
      var headers = frame['headers'];
      switch (frame['command']) {
      case "CONNECT":
        Stomp.send_frame(socket, {
          command : "CONNECTED",
          headers : {
            session : sessionId,
          },
          content : ""
        });
        break;
      default:
        Stomp.send_error(socket, "No valid command frame");
        break;
      }
    });
  });

}