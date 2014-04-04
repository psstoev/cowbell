#!/usr/bin/env node

var http = require("http");
var express = require("express");
var fs = require("fs");
var path = require("path");
var url = require("url");
var socketIo = require("socket.io");

var GameSession = require("./lib/game-session");
var playerCount = 0;
var playerSockets = {};
var currentPlayer = null;

var gameSession = new GameSession();

gameSession.game.on("playerWon", function() {
    playerSockets[currentPlayer].emit("correct", { guess: gameSession.game.target });
}).on("foundCowsAndBulls", function(result) {
    playerSockets[currentPlayer].emit("found", result);
}).on("invalidGuess", function(guess) {
    playerSockets[currentPlayer].emit("error", { guess: guess });
});

var app = express();
app.configure(function() {
    app.use(express.static(__dirname));
    app.use(express.compress());
});

var httpServer = http.createServer(app);
httpServer.listen(8080);
var io = socketIo.listen(httpServer);

io.sockets.on("connection", function(socket) {
    if (gameSession.hasStarted) {
        socket.emit("already started");
        return;
    }

    playerCount++;
    var playerId = "player" + playerCount;

    socket.emit("welcome", playerId);

    gameSession.addPlayer(playerId);
    playerSockets[playerId] = socket;

    if (playerCount === 3) {
        gameSession.start();
    }

    socket.on("guess", function(guess) {
        if (gameSession.hasStarted && gameSession.currentPlayer === playerId) {
            currentPlayer = playerId;
            gameSession.game.tryGuess(guess);
        } else {
            playerSockets[playerId].emit("wait");
        }
    }).on("give up", function() {
        gameSession.removePlayer(playerId);
        socket.emit("give up", { number: gameSession.game.target });
    }).on("disconnect", function() {
        gameSession.removePlayer(playerId);
    });
});
