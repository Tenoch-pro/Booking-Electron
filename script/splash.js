'use strict'

const { ipcRenderer } = require('electron')
var http = require('http')

setTimeout(function(){

    var options = {
        host: 'www.google.com'
    };

    var req = http.get(options, function(res) {
        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function(chunk) {
          // You can process streamed parts here...

        }).on('end', function() {
            document.getElementsByClassName('loader')[0].style.display = "none";
            ipcRenderer.send('main-view')
            
          // ...and/or process the entire body here.
        })
      });

      req.on('error', function(e) {
        document.getElementsByClassName('loader')[0].style.display = "none";
        document.getElementsByClassName('failed')[0].style.display = "block";
      });


}, 1000)
