//Code modified from https://robots.thoughtbot.com/pong-clone-in-javascript

var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60)
};
var canvas = document.createElement("canvas");
width = 400;
height = 600;
canvas.width = 400;
canvas.height = 600;
var context = canvas.getContext('2d');

var Player1 = new Player(1);
var Player2 = new Player(2);
var ball = new Ball(200, 300);

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

var keysDown = {};

var render = function () {
    context.fillStyle = "#eee";
    context.fillRect(0, 0, width, height);
    Player1.render();
    Player2.render();
    ball.render();
};

var update = function () {
    Player1.update();
    Player2.update(ball);
    ball.update(Player1.paddle, Player2.paddle);
};

var step = function () {
    update();
    render();
    animate(step);
};

function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}

Paddle.prototype.render = function () {
    context.fillStyle = "#0000FF";
    context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function (x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if (this.x < 0) {
        this.x = 0;
        this.x_speed = 0;
    } else if (this.x + this.width > 400) {
        this.x = 400 - this.width;
        this.x_speed = 0;
    }
};

function Player(no) {
    if(no == 1){
        this.paddle = new Paddle(175, 580, 50, 10);
        this.id = 'team1';
    }

    if(no == 2){
        this.paddle = new Paddle(175, 10, 50, 10);
        this.id = 'team2';
    }
}

Player.prototype.render = function () {
    this.paddle.render();
};

Player.prototype.update = function () {
    if(controldata[this.id].total <= 0)
        return false;

    this.paddle.move(4 / controldata[this.id].total* (controldata[this.id].right - controldata[this.id].left), 0);
};

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 3;
}

Ball.prototype.render = function () {
    context.beginPath();
    context.arc(this.x, this.y, 5, 2 * Math.PI, false);
    context.fillStyle = "#000000";
    context.fill();
};

Ball.prototype.update = function (paddle1, paddle2) {
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;

    if (this.x - 5 < 0) {
        this.x = 5;
        this.x_speed = -this.x_speed;
    } else if (this.x + 5 > 400) {
        this.x = 395;
        this.x_speed = -this.x_speed;
    }

    if(this.y < 0){
        console.log('team1 wins!');
        this.x_speed = 0;
        this.y_speed = -3;
        this.x = 200;
        this.y = 300;
        $('#team1-score').text(parseInt($('#team1-score').text()) + 1);
        socket.emit('winner', 'team1');
    }

    if(this.y > 600){
        console.log('team2 wins!');
        this.x_speed = 0;
        this.y_speed = 3;
        this.x = 200;
        this.y = 300;
        $('#team2-score').text(parseInt($('#team2-score').text()) + 1);
        socket.emit('winner', 'team2');
    }

    if (top_y > 300) {
        if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
            this.y_speed = -3;
            this.x_speed += (paddle1.x_speed / 2);
            this.y += this.y_speed;
        }
    } else {
        if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
            this.y_speed = 3;
            this.x_speed += (paddle2.x_speed / 2);
            this.y += this.y_speed;
        }
    }
};

document.getElementsByClassName('canvas-container')[0].appendChild(canvas);
animate(step);

window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});

socket.on('controldata', function(data){
    controldata = jQuery.extend(true, {}, data);
});

$('#reset-score').on('click', function(){
    $('#team1-score').text('0');
    $('#team2-score').text('0');
});

$('#reset-clients').on('click', function(){
    socket.emit('reset-client', 'true');
});