var chai = require("chai");
var expect = chai.expect;
var Server = require("../lib/server");
var Player = require("../lib/player");
var GameSession = require("../lib/game-session");

describe("Server", function() {
    describe("Players", function() {
        var server;

        beforeEach(function() {
            server = new Server();
        });

        it("creates new players on demand", function() {
            expect(server.getPlayer()).to.be.instanceof(Player);
        });

        it("retrieves existing players by id", function() {
            var player = server.getPlayer();

            expect(server.getPlayer(player.id)).to.eq(player);
        });

        it("can return a list of all players", function() {
            server.getPlayer();
            server.getPlayer();

            expect(server.getPlayers().length).to.eq(2);
        });
    });

    describe("Games", function() {
        var server;
        var player;

        beforeEach(function() {
            server = new Server();
            player = server.getPlayer();
        });

        it("creates new games on demand from players", function() {
            var game = server.createGame(player);

            expect(game).to.be.instanceof(GameSession);
            expect(game.players).to.contain(player);
        });

        it("retrieves existing games by id", function() {
            var game = server.createGame(player);

            expect(server.getGame(game.id)).to.eq(game);
        });

        it("can return a list of all games", function() {
            var game = server.createGame(player);

            expect(server.getGames().length).to.eq(1);
        });
    });
});
