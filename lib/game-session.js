var Game = require("./game");

function GameSession(target) {
    var that = this;

    this.game = new Game(target);
    this.hasStarted = false;
    this.players = [];
    this.currentPlayerIndex = 0;
    this.currentPlayer = null;
    this.winner = null;

    this.game.on("correct", function() {
        that.winner = that.currentPlayer;
    }).on("valid", function() {
        that.nextPlayer();
    });
}

GameSession.prototype.addPlayer = function(player) {
    if (this.players.indexOf(player) === -1 && !this.hasStarted) {
        this.players.push(player);
    }
};

GameSession.prototype.removePlayer = function(player) {
    if (this.currentPlayer === player) {
        this.nextPlayer();
    }

    this.players = this.players.filter(function(currentPlayer) {
        return currentPlayer != player;
    });

    // Fix the current player index:
    this.currentPlayerIndex = this.players.indexOf(this.currentPlayer);
};

GameSession.prototype.start = function() {
    if (this.players.length > 0) {
        this.hasStarted = true;
        this.currentPlayer = this.players[this.currentPlayerIndex];
    }
};

GameSession.prototype.nextPlayer = function() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

    this.currentPlayer = this.players[this.currentPlayerIndex];
};

module.exports = GameSession;
