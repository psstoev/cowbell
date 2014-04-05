function Player(id, server) {
    this.id = id;
    this.server = server;
    this.inGame = false;
}

Player.prototype.initiateGame = function() {
    this.server.createGame(this);
};

module.exports = Player;
