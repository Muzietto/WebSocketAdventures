var express = require('express');
var router = express.Router();
var wsServer = require('../../wsServer');

router.get('/simulation', (req, res) => {
  console.log('starting simulation');
  var exec = require('child_process').exec;
  var child = exec('node spawner_button/server/cli/longRunningJob.js');
  child.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
    wsServer.broadcast(data);
  });
  child.stderr.on('data', function(data) {
    console.log('stderr: ' + data);
    wsServer.broadcast(data);
  });
  child.on('close', function(code) {
    wsServer.broadcast('end_job: code=' + code);
    console.log('closing code: ' + code);
  });
  res.send(200, 'job_started');
});

module.exports = router;