var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var fs = require('fs');
var http = require('http');

var app = express();
var httpServer = require('http').Server(app);
var io = require('socket.io')(httpServer);

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

var clientSockets = [];

//io.set('origin', '*'); //Bei Problemen mit CORS

io.on('connection', function(socket){

  /* ClientSocket der Socket-Liste hinzufügen*/
  clientSockets.push(socket);
  console.log('Verbindung mit Webapp hergestellt!');

  /*Senden der Daten*/
  socket.on('getQueue', function(){
    sendQueue(socket);
  });

  socket.on('getSongs', function(){
    sendSongs(socket);
  });

  /*Verarbeite Daten*/
  socket.on('postQueue', function(data){
    postQueue(data);
    //sendQueue(socket);
  });


  /* ClientSocket bei Verbindungsabbruch aus der Socket-Liste entfernen */
  socket.on('disconnect', function(){
    console.log("Verbindung mit Webapp abgebrochen!");
    clientSockets.splice(clientSockets.indexOf(socket),1);
  });
});



httpServer.listen(port);

/* Nachricht, die von einem CLient kommt, an alle anderen CLients weierreichen */
/*
clientSockets.forEach(function(clientSocket) {
  clientSocket.send(data);
});*/

/*API Functions*/
function sendQueue(socket) {
  var options = {
      host: 'localhost',
      port: 3000,
      path: '/api/queue',
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
  };

  var externalRequest = http.request(options, function(externalResponse){
    console.log('Verbindung mit Webservice hergestellt!');
    externalResponse.on('data', function(chunk){
      var queuedata = JSON.parse(chunk);
      socket.emit("resQueue",queuedata);
    });
  });
  externalRequest.end();
}

function sendSongs(socket) {
  var options = {
      host: 'localhost',
      port: 3000,
      path: '/api/songs',
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
  };

  var externalRequest = http.request(options, function(externalResponse){
    console.log('Verbindung mit Webservice hergestellt!');
    externalResponse.on('data', function(chunk){
      var songdata = JSON.parse(chunk);
      socket.emit("resSongs",songdata);
    });
  });
  externalRequest.end();
}

function postQueue(index) {
  /*var options = {
      host: 'localhost',
      port: 3000,
      path: '/api/queue',
      method: 'POST',
      headers: {
        accept: 'application/json'
      }
  };

  var externalRequest = http.request(options, function(externalResponse){
    console.log('Verbindung mit Webservice hergestellt!');
    externalResponse.setEncoding('utf8');
    externalResponse.on('data', function(chunk){
      var queuedata = JSON.parse(chunk);
      //socket.emit("resQueue",queuedata);
    });
  });
  externalRequest.write('{"id": "XX", "genre": "House"}');
  externalRequest.end();*/
}