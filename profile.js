var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var pg = require('pg');

var conString = "postgres://postgres:zmaooj@localhost/gotomenu";

var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime);
    //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
    client.end();
  });
});
/*
var redis = require("redis");
var client = redis.createClient();
*/

app.get('/', function(req, res){
  res.sendFile(__dirname + '/profile.html')
});

//client.set('app name', "Darian Chat");//

app.use("/profile.css", express.static(__dirname + '/profile.css'));

app.use("/script.js", express.static(__dirname + '/script.js'));

//client.get('app name', data);///

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log('a user connected');
   socket.on('submitform', function(address, city, province){
    console.log(address + city + province);
    var client = new pg.Client(conString);
       client.connect(function(err) {
           if(err) {
               return console.error('could not connect to postgres', err);
           }
           client.query('INSERT INTO locations (address, city, province) VALUES ($1, $2, $3)', [address, city, province], function (err, result) {
               if(err) {
                   return console.error('error running query', err);
               }
               // return the client to the connection pool for other requests to reuse
               console.log(address + city +province + "is now added to users table");
               client.end();
               //res.writeHead(200, {'content-type': 'text/plain'});
               //res.end('You are visitor number ' + result.rows[0].count);

               //alert('done!!!');
           });
       //console.log(country + city + name + "is now added to places table");
       });
   });
   
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});














/*io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

io.emit('some event', { for: 'everyone' });

io.on('connection', function(socket){
  socket.broadcast.emit('hi');
});


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});*/