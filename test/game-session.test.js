var chai = require("chai");
var expect = chai.expect;
var GameSession = require("../lib/game-session");

describe("GameSession", function() {
    var gameSession;

    beforeEach(function() {
        gameSession = new GameSession();
    });

    it("initializes a Game with optional target", function() {
        expect(gameSession.game).to.not.be.null;
        expect((new GameSession("1234")).game.target).to.eq("1234");
    });

    it("allows players to join", function() {
        gameSession.addPlayer("player1");
        expect(gameSession.players).to.deep.eq(["player1"]);
    });

    it("does not join a player twice", function() {
        gameSession.addPlayer("player1");
        gameSession.addPlayer("player1");
        expect(gameSession.players).to.deep.eq(["player1"]);
    });

    it("does not allow new players after it has started", function() {
        gameSession.addPlayer("player1");
        gameSession.start();
        gameSession.addPlayer("player2");
        expect(gameSession.players).to.deep.eq(["player1"]);
    });

    it("allows players to leave", function() {
        gameSession.addPlayer("player1");
        gameSession.removePlayer("player1");
        expect(gameSession.players).to.deep.eq([]);
    });

    it("does not start without players", function() {
        gameSession.start();
        expect(gameSession.hasStarted).to.be.false;
        gameSession.addPlayer("player1");
        gameSession.start();
        expect(gameSession.hasStarted).to.be.true;
    });

    describe("with players", function() {
        var gameSession;

        beforeEach(function() {
            gameSession = new GameSession("1234");
            gameSession.addPlayer("player1");
            gameSession.addPlayer("player2");
            gameSession.start();
        });

        it("remembers who is the current player", function() {
            expect(gameSession.currentPlayer).to.eq("player1");
        });

        it("cycles between players", function() {
            expect(gameSession.currentPlayer).to.eq("player1");
            gameSession.nextPlayer();
            expect(gameSession.currentPlayer).to.eq("player2");
        });

        it("switches to the next player after the current one is removed", function() {
            gameSession.removePlayer("player1");
            expect(gameSession.currentPlayer).to.eq("player2");
            expect(gameSession.currentPlayerIndex).to.eq(0);
        });

        it("tells when someone wins", function() {
            gameSession.game.tryGuess("1023");
            gameSession.game.tryGuess("1234");

            expect(gameSession.winner).to.eq("player2");
        });
    });
});
