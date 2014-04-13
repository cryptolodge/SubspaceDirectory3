var ZONE_LISTEN_PORT = 4991;
var ZONE_LISTEN_HOST = "0.0.0.0";

console.log("Subspace2 Directory Server");
//load config
console.log("Loading Configuration");
var config = require('./config/configuration');
//load required modules
console.log("Loading modules");
var binary = require("binary"); 
var mongoose = require("mongoose");
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var fs = require('fs');
var moment = require('moment');

//now try db connection
var connect = function() {
    var options = { server: { socketOptions: { keepAlive: 1 } } }
    var dbConnectionString = "mongodb://" + config.database.username + ":" + config.database.password + "@" + config.database.host;
    mongoose.connect(dbConnectionString, options);
}
connect();

//Error Handler
mongoose.connection.on("error", function(err) {
    console.log(err);
});

mongoose.connection.on("disconnected", function() {
    connect();
});

//loading models

console.log("Loading Models");

var models_path = __dirname + '/model';
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
})

//starting server
console.log("Starting Server");


server.on("listening", function() {
    var address = server.address;
    console.log("UDP Server Listening on " + address.address + ":" + address.port);

    });

server.on("message", function(message, remote) {
     console.log("Message Received");
     var buf = new Buffer(message);
     var vars = binary.parse(buf)
                    .word32lu('ip')
                    .word16lu('port')
                    .word16lu('playerCount')
                    .word16lu('scoreKeeping')
                    .word32lu('serverVersion')
                    .buffer('name',32)
                    .buffer('password',48)
                    .scan('description','\0')
                    .vars;
    //set the ip to remote address
    //if it is not provided
    if(vars.ip == 0)
    {
        vars.ip = remote.address;
    }

    var Zone = mongoose.model('Zone');
    var zone;
    Zone.findByNameAndPassword(vars.name, vars.password, function(err, zoneFindResult) {
        console.log("Zone update from " + remote.address + ':' + remote.port + " Name: " + vars.name);
        if(!err) {
            if(!zoneFindResult) {
                console.log("Adding New Zone: " + vars.name);
                zone = new Zone();
            } else {
                console.log("Updating Zone: " + vars.name);
                zone = zoneFindResult;              
                zone.metadata.lastUpdated = moment();
            }
            //update
            zone.ip = vars.ip;
            zone.port = vars.port
            zone.playerCount = vars.playerCount;
            zone.scoreKeeping = vars.scoreKeeping == 1;
            zone.name = vars.name;
            zone.password = vars.password;
            zone.description = vars.description;
            zone.save(function (err) {
            if (err) 
                console.log(err);
            });
        } else {
            console.log(err);
        }
    });
});

server.bind(ZONE_LISTEN_PORT, ZONE_LISTEN_HOST);


exports = module.exports = server;

   