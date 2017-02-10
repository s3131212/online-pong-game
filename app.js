var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var server_url = 'localhost';
var server_port = '8080';

//counter
var controldata = {
    team1: {
        left: 0,
        right: 0,
        total: 0
    },
    team2: {
        left: 0,
        right: 0,
        total: 0
    }
}
var playerdata = {};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.render('index',{
        server_url: server_url,
        server_port: server_port
    });
});
app.get('/control', function (req, res) {
    res.render('control',{
        server_url: server_url,
        server_port: server_port
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

io.on('connection', function (socket) {
    //socket.emit('news', { hello: 'world' });
    socket.on('control', function (data) {
        var playerteam = '';
        if(typeof io.sockets.adapter.sids[socket.id]['team1'] !== 'undefined'){
            playerteam = 'team1';
        }
        if(typeof io.sockets.adapter.sids[socket.id]['team2'] !== 'undefined'){
            playerteam = 'team2';
        }

        if(playerteam != ''){
            if(data.type == 'keydown'){
                //controldata[playerteam][data.which]++;
                playerdata[socket.id][data.which] = 1;
            }
            if(data.type == 'keyup'){
                //controldata[playerteam][data.which]--;
                playerdata[socket.id][data.which] = 0;
            }

            //recalculate player data
            //workaround here
            controldata.team1.left = 0;
            controldata.team1.right = 0;
            controldata.team2.left = 0;
            controldata.team2.right = 0;
            for (var key in playerdata) {
                if (playerdata.hasOwnProperty(key)) {
                    if(playerdata[key].left == 1){
                        controldata[playerdata[key].team].left++;
                    }
                    if(playerdata[key].right == 1){
                        controldata[playerdata[key].team].right++;
                    }
                }
            }

        }

        console.log(controldata);
    });
    socket.on('register', function(){
        console.log(controldata.team1.total);
        console.log(controldata.team2.total);
        if(controldata.team1.total <= controldata.team2.total){
            socket.emit('team', 'team1');
            socket.join('team1');
            playerdata[socket.id] = {
                left: 0,
                right: 0,
                team: 'team1'
            }
            console.log('team1: new player!');
        }else{
            socket.emit('team', 'team2');
            socket.join('team2');
            playerdata[socket.id] = {
                left: 0,
                right: 0,
                team: 'team2'
            }
            console.log('team2: new player!');
        }

        

    });
    socket.on('winner', function(data){
        io.sockets.emit('winner', data);
    });
    socket.on('reset-client', function(){
        controldata = {
            team1: {
                left: 0,
                right: 0,
                total: 0
            },
            team2: {
                left: 0,
                right: 0,
                total: 0
            }
        }
        io.sockets.emit('reset-client');
    });
    socket.on('disconnect', function () {
        delete playerdata[socket.id];
    });
    setInterval(function(){
        //Verify data
        controldata.team1.total = (typeof io.sockets.adapter.rooms['team1'] == 'undefined') ? 0 : io.sockets.adapter.rooms['team1'].length;
        controldata.team2.total = (typeof io.sockets.adapter.rooms['team2'] == 'undefined') ? 0 : io.sockets.adapter.rooms['team2'].length;
        
        if(controldata.team1.left < 0) controldata.team1.left = 0; 
        if(controldata.team1.right < 0) controldata.team1.right = 0; 
        if(controldata.team2.left < 0) controldata.team2.left = 0; 
        if(controldata.team2.right < 0) controldata.team2.right = 0; 

        //console.log(controldata);
        socket.emit('controldata', controldata); 
    }, 1000/60);
});

//app.listen(8080);
server.listen(server_port);
module.exports = app;
