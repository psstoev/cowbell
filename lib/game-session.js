var Game = require("./game");

function GameSession(target) {
    var gameSession = this;

    this.game = new Game(target);
    this.hasStarted = false;
    this.players = [];
    this.currentPlayerIndex = 0;
    this.winner = null;

    this.game.on("correct", function() {
        gameSession.winner = gameSession.players[gameSession.currentPlayerIndex];
    }).on("valid", function(result) {
        gameSession.players[gameSession.currentPlayerIndex].emit("found", result);
        gameSession.nextPlayer();
    });
}

GameSession.prototype.addPlayer = function(player) {
    if (this.players.indexOf(player) === -1 && !this.hasStarted) {
        this.players.push(player);
    }
};

GameSession.prototype.removePlayer = function(player) {
    var gameSession = this;

    gameSession.players = gameSession.players.filter(function(currentPlayer) {
        return currentPlayer != player;
    });

    // Fix the current player index:
    if (gameSession.currentPlayerIndex < gameSession.players.length) {
        gameSession.currentPlayerIndex = (gameSession.currentPlayerIndex + 1) % gameSession.players.length;
    } else {
        gameSession.currentPlayerIndex = 0;
    }

    gameSession.notifyPlayers();
};

GameSession.prototype.start = function() {
    var gameSession = this;

    if (gameSession.players.length > 0) {
        gameSession.hasStarted = true;
        gameSession.notifyPlayers();
    }
};

GameSession.prototype.nextPlayer = function() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

    this.notifyPlayers();
};

GameSession.prototype.notifyPlayers = function() {
    var gameSession = this;
    var currentPlayerIndex = gameSession.currentPlayerIndex;

    gameSession.players.forEach(function(player, playerIndex) {
        if (playerIndex === currentPlayerIndex) {
            player.emit("guess");
        } else {
            player.emit("wait");
        }
    });
};

GameSession.prototype.tryGuess = function(player, guess) {
    if (this.players[this.currentPlayerIndex] === player) {
        this.game.tryGuess(guess);
    }
};

module.exports = GameSession;
