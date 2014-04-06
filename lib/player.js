var events = require("events");
var util = require("util");

function Player(id, server) {
    this.id = id;
    this.server = server;
    this.game = null;
    this.currentPlayer = false;

    this.on("guess", function() {
        this.currentPlayer = true;
    }).on("wait", function() {
        this.currentPlayer = false;
    });
}

util.inherits(Player, events.EventEmitter);

Player.prototype.initiateGame = function() {
    this.game = this.server.createGame(this);
};

Player.prototype.joinGame = function(game) {
    if (!this.game) {
        game.addPlayer(this);
        this.game = game;
    }
};

Player.prototype.leaveGame = function() {
    if (this.game) {
        this.game.removePlayer(this);
        this.game = null;
    }
};

Player.prototype.startGame = function() {
    if (this.game) {
        this.game.start();
    }
};

Player.prototype.tryGuess = function(guess) {
    if (this.game && this.currentPlayer) {
        this.game.tryGuess(this, guess);
    }
};

module.exports = Player;
