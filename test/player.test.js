var chai = require("chai");
var spies = require("chai-spies");
var expect = chai.expect;

chai.use(spies);

var Player = require("../lib/player");

describe("Player", function() {
    var player;
    var server;
    var game;
    
    beforeEach(function() {
        server = {
            createGame: chai.spy(function() { return game; }),
        };
        player = new Player("id0", server);
        game = {
            addPlayer: chai.spy(),
            removePlayer: chai.spy(),
        };
    });

    it("can be created with the desired properties", function() {
        expect(player.id).to.eq("id0");
        expect(player.server).to.eq(server);
        expect(player.game).to.be.null;
    });

    it("can ask the server to create a new game", function() {
        player.initiateGame();

        expect(server.createGame).to.have.been.called().with(player);
        expect(player.game).to.eq(game);
    });

    it("can join existing games", function() {
        player.joinGame(game);

        expect(game.addPlayer).to.have.been.called().with(player);
        expect(player.game).to.eq(game);
    });

    it("cannot join a game if it is in another game", function() {
        var anotherGame = {
            addPlayer: chai.spy(),
        };

        player.joinGame(game);
        player.joinGame(anotherGame);

        expect(anotherGame.addPlayer).to.not.have.been.called();
    });

    it("can leave the game", function() {
        player.joinGame(game);
        player.leaveGame();

        expect(game.removePlayer).to.have.been.called().with(player);
        expect(player.game).to.be.null;
    });
});
