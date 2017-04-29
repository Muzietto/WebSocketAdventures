var express = require('express');
var router = express.Router();
var wsServer = require('../../wsServer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Spawner Button demo' });
  wsServer.clearClients();
});

module.exports = router;
