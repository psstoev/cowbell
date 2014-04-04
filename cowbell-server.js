var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");
var socketIo = require("socket.io");
var Game = require("./lib/game");
var io;

var app = http.createServer(function(request, response) {
    var filename = url.parse(request.url).pathname;

    if (filename === "/") {
        filename = "index.html";
    } else {
        filename = filename.slice(1); // Remove the leading "/"
    }

    fs.readFile(path.resolve(__dirname, filename), function(err, data) {
        if (err) {
            response.writeHead(404); // Ignore missing files
            response.end();
            return;
        }

        response.writeHead(200);
        response.end(data);
    });
});

io = socketIo.listen(app);
app.listen(8080);

io.sockets.on("connection", function(socket) {
    var game = new Game();

    game.on("playerWon", function() {
        socket.emit("correct", { guess: game.target });
    }).on("foundCowsAndBulls", function(result) {
        socket.emit("found", result);
    }).on("invalidGuess", function(guess) {
        socket.emit("error", { guess: guess });
    })

    socket.on("guess", function(guess) {
        game.tryGuess(guess);
    }).on("give up", function() {
        socket.emit("give up", { number: game.target });
    });
});
