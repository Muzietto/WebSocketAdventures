
var WebSocketServer = require('ws').Server,
server = new WebSocketServer({
    port : 8181
  });
var stockUpdater;

var stocks = {
  "AAPL" : 95.0,
  "MSFT" : 50.0,
  "AMZN" : 300.0,
  "GOOG" : 550.0,
  "YHOO" : 35.0
}

randomStockUpdater();

server.on('connection', function (socket) {
  var clientStockUpdater;
  var clientStocks = [];

  console.log('client is connected');

  clientStockUpdater = setInterval(function () {
      sendStockUpdates(socket);
    }, 1000);

  socket.on('message', function (message) {
    console.log("readyState is " + socket.readyState);
    console.log("protocol is " + socket.protocol);
    console.log("bufferedAmount is " + socket.bufferedAmount);

    var stock_request = JSON.parse(message);
    clientStocks = stock_request['stocks'];

    sendStockUpdates(socket);
  });

  socket.on('close', function (code) {
    console.log("code is " + code);
    console.log("readyState is " + socket.readyState);
    console.log('socket is being closed');
    debugger;
    if (typeof clientStockUpdater !== 'undefined') {
      clearInterval(clientStockUpdater);
    }
  });

  function sendStockUpdates (socket) {
    if (socket.readyState == 1) {
      var stocksObj = {};
      for (var i = 0; i < clientStocks.length; i++) {
        symbol = clientStocks[i];
        stocksObj[symbol] = stocks[symbol];
      }
      console.log("Sending data");
      socket.send(JSON.stringify(stocksObj));
    }
  }
});

function randomStockUpdater() {
  for (var symbol in stocks) {
    if (stocks.hasOwnProperty(symbol)) {
      var randomizedChange = randomInterval(-150, 150);
      var floatChange = randomizedChange / 100;
      stocks[symbol] += floatChange;
    }
  }
  var randomMSTime = randomInterval(500, 2500);
  stockUpdater = setTimeout(function () {
      randomStockUpdater();
    }, randomMSTime)
}

function randomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
