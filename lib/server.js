var Player = require("./player");
var GameSession = require("./game-session");

function Server() {
    this.players = {};
    this.playerCount = 0;
    this.games = {};
    this.gameCount = 0;
}

Server.prototype.getPlayer = function(playerId) {
    if (typeof playerId !== "undefined") {
        return this.players[playerId];
    } else {
        playerId = this.playerCount;

        this.players[playerId] = new Player(playerId, this);
        this.playerCount++;

        return this.players[playerId];
    }
};

Server.prototype.getPlayers = function() {
    var that = this;

    return Object.keys(that.players).map(function(playerId) {
        return that.players[playerId];
    });
};

Server.prototype.createGame = function(player) {
    var gameSession = new GameSession();
    var gameId = this.gameCount;

    gameSession.id = gameId;
    gameSession.addPlayer(player);

    this.games[gameId] = gameSession;
    this.gameCount++;

    return gameSession;
};

Server.prototype.getGame = function(gameId) {
    return this.games[gameId];
};

Server.prototype.getGames = function(gameId) {
    var that = this;

    return Object.keys(that.games).map(function(gameId) {
        return that.games[gameId];
    });
};

module.exports = Server;
