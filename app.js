var fs = require('fs');
var http = require('http');

// Serve client side statically
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);

// Start Binary.js server
var BinaryServer = require('binaryjs').BinaryServer;
var bs = BinaryServer({server: server, path: '/binary'});

// Wait for new user connections
bs.on('connection', function(client){
  // Incoming stream from browsers
  client.on('stream', function(stream, meta){
    //
    var file = fs.createWriteStream(__dirname+ '/public/uploads/' + meta.name);
    stream.pipe(file);
    //
    // Send progress back
    stream.on('data', function(data){
      //console.log(data);
      stream.write({rx: data.length / meta.size, file_uri: 'http://uploads.xtopoly.com/uploads/' + meta.name});
    });

    //
  });
});
//
//

server.listen(9000);
console.log('HTTP and BinaryJS server started on port 9000');
