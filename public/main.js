(function() {
  var client = new BinaryClient('ws://localhost:7089/binary');

    client.on('open', function(){
      var box = $('#box');
      box.on('dragenter', doNothing);
      box.on('dragover', doNothing);
      box.html('<p>Drag files here<br><small>500KB max | .txt only</small></p>');
      box.on('drop', function(e){
        e.originalEvent.preventDefault();
        var file = e.originalEvent.dataTransfer.files[0];

        // `client.send` is a helper function that creates a stream with the
        // given metadata, and then chunks up and streams the data.
        var stream = client.send(file, {name: file.name, size: file.size});

        // Print progress
        var tx = 0;
        var fileUrl = null;
        stream.on('data', function(data) {
          console.log(data);
          var percent = Math.round(tx+=data.rx*100);
          $('#progress').text(percent + '% complete');
          if (percent === 100) {
            fileUrl = data.fileUrl;
            end();
          }
        });
        function end() {
          $('<div id="list"></div>').append($('<a></a>').text(file.name).prop('href', fileUrl)).appendTo('body');
        }
      });
    });

    client.on('error', function(err) {
      console.error('error', err);
    });

    // Deal with DOM quirks
    function doNothing(e){
      e.preventDefault();
      e.stopPropagation();
    }
})();
