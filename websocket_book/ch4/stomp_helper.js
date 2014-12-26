(function (NS) {

  NS.process_frame = function (dataString) {
    var lines = dataString.split("\n");
    var frame = {};
    frame['headers'] = {};

    if (lines.length > 1) {
      frame['command'] = lines[0];
      var x = 1;
      while (lines[x].length > 0) {
        var header_split = lines[x].split(':');
        var key = header_split[0].trim();
        var val = header_split[1].trim();
        frame['headers'][key] = val;
        x += 1;
      }
      
      frame['content'] = lines
        .splice(x + 1, lines.length - x)
        .join("\n");
      frame['content'] = frame['content']
        .substring(0, frame['content'].length - 1);
    }
    return frame;
  };
  
  NS.stringify_frame = function(frame) {
    var data = frame['command'] + "\n";
    var header_content = "";
    for (var key in frame['headers']) {
      if (frame['headers'].hasOwnProperty(key)) {
        header_content += key
         + ": "
         + frame['headers'][key]
         + "\n";
      }
    }
    data += header_content;
    data += "\n\n";
    data += frame['content'];
    data += "\n\0";
    return data;
  }
  
  NS.send_frame = function (socket, dataString) {
    socket.send(dataString);
  };
  
  NS.send_error = function (socket, message, detail) {
    headers = {};
    if (message) {
      headers['message'] = message;
    } else {
      headers['message'] = "No error message given";
    }
    
    NS.send_frame(socket, {
      "command" : "ERROR",
      "headers" : headers,
      "content" : detail
    });
  };
})(typeof exports === 'undefined' ? this['Stomp'] = {} : exports);