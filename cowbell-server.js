#!/usr/bin/env node

var http = require("http");
var express = require("express");
var socketIo = require("socket.io");
var path = require("path");

var Server = require("./lib/server");

var server = new Server();

var socketPool = {};

var connectPlayerToGame = function(player, gameSession) {
    var socket = socketPool[player.id];

    // Wire sockets:
    if (socket) {
        socket.on("start", function() {
            gameSession.start();
        }).on("guess", function(guess) {
            gameSession.tryGuess(player, guess);
        }).on("giveUp", function() {
            gameSession.removePlayer(player);
            socket.emit("giveUp", { number: gameSession.game.target });
        });

        player.on("guess", function() {
            socket.emit("guess");
        }).on("wait", function() {
            socket.emit("wait");
        }).on("found", function(result) {
            socket.emit("found", result);
        }).on("gameStarted", function() {
            socket.emit("gameStarted");
        }).on("youWon", function() {
            // TODO: remove the game from the game pool
            socket.emit("youWon", { number: gameSession.game.target });
        }).on("youLost", function() {
            socket.emit("youLost", { number: gameSession.game.target });
        });
    }
};

var app = express();
app.configure(function() {
    app.use(express.static(path.join(__dirname, "public")));
    app.use(express.compress());
    app.use(express.urlencoded());

    app.get("/players", function(request, response) {
        response.send(server.getPlayers().map(function(player) {
            return { id: player.id };
        }));
    });

    app.get("/players/new", function(request, response) {
        response.send({ id: server.getPlayer().id });
    });

    app.get("/games", function(request, response) {
        // TODO: move this to GameSession:
        response.send(server.getGames().filter(function(game) {
            return !game.hasStarted;
        }).map(function(game) {
            return { id: game.id };
        }));
    });

    app.post("/games/new", function(request, response) {
        var playerId = request.body.id;
        var gameSession;
        var player;

        if (playerId) {
            player = server.getPlayer(playerId);
            gameSession = server.createGame(player);
            connectPlayerToGame(player, gameSession);
            response.send({ id: gameSession.id });
        }
    });

    app.post("/games/:id/join", function(request, response) {
        var gameSession = server.getGame(request.params.id);
        var playerId = request.body.id;

        if (gameSession && playerId) {
            player = server.getPlayer(playerId);

            if (!gameSession.hasStarted) {
                gameSession.addPlayer(player);
                connectPlayerToGame(player, gameSession);
                response.send({ id: gameSession.id });
            }
        }
    });
});

var httpServer = http.createServer(app);
httpServer.listen(8080);
var io = socketIo.listen(httpServer);

io.sockets.on("connection", function(socket) {
    socket.on("hello", function(playerId) {
        if (typeof socketPool[playerId] === "undefined") {
            socketPool[playerId] = socket;
        }
    });
});
