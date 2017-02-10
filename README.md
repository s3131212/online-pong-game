# Online Pong Game
This is multiple players [pong game](https://en.wikipedia.org/wiki/Pong) designed for massive players.

## Installation

Clone it first!  
```
git clone git@github.com:s3131212/online-pong-game.git  
cd online-pong-game  
npm install
```

Open `app.js`, edit the server url on `line 13` and the server port on `line 14`.  
```
var server_url = 'localhost'; //both URL and IP is allowed
var server_port = '8080';
``` 

Then run it!  
```
node app.js
```

Open `server_url:server_port` (localhost:8080 by default) in browser and you'll see the game panel.  
Open `server_url:server_port/control` (localhost:8080/control by default) in another browser and control the paddle by clicking two gray blocks in the webpage or right/left arrow keys on the keyboard.

![image](http://i.imgur.com/DKOw5IL.png)

##Benchmark
I use [websocket bench](https://github.com/M6Web/websocket-bench) to do the benchmarking.  
```
websocket-bench -a 500 -c 10 -w 1 -g ./websocket-bench.js http://localhost:8080
```

I ran the test on macOS 10.12 with i7-6700 and 16GB RAM. The game server was working smoothly when 100 clients were connected and a little laggy but still playable when 300 clients were connected.

##License
This project is released under MIT License. Please read "[LICENSE](LICENSE)" for more information.  
The `pong.js` (the front-end javascript file) is adapted from [this blog post](https://robots.thoughtbot.com/pong-clone-in-javascript) by Matt Mongeau with permission.
