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

    socket.on("guess", function(guess) {
        var cows, bulls;
        var result = game.tryGuess(guess);

        result.guess = guess;

        if (!result.error) {
            if (result.bulls === 4) {
                socket.emit("correct", result);
            } else {
                socket.emit("found", result);
            }
        } else {
            socket.emit("error", result);
        }
    }).on("give up", function() {
        socket.emit("give up", { number: game.target });
    });
});
