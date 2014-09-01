var fs = require('fs');
var http = require('http');
var port = 7089;

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);

var BinaryServer = require('binaryjs').BinaryServer;
var bs = BinaryServer({server: server, path: '/binary'});

bs.on('connection', function(client){

  client.on('stream', function(stream, meta){

    var size = meta.size / 1024 / 1024; // MB

    if (!(size <= .5 && /(\.txt)+$/gi.test(meta.name))) return;

    var extension = meta.name.split('.').pop();
    var filename = +(new Date) + '.' + extension;
    var file = fs.createWriteStream(__dirname+ '/public/uploads/' + filename);
    stream.pipe(file);

    stream.on('data', function(data){
      // send progress back
      stream.write({rx: data.length / meta.size, fileUrl: 'http://localhost:' + port + '/uploads/' + filename});
    });


  });
});

server.listen(port);

console.log('BinaryJS server listening  on port ' + port);
