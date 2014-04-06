function Player(id, server) {
    this.id = id;
    this.server = server;
    this.game = null;
}

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

module.exports = Player;
