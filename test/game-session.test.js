var chai = require("chai");
chai.use(require("chai-spies"));
var expect = chai.expect;
var GameSession = require("../lib/game-session");

describe("GameSession", function() {
    var gameSession;
    var player1;
    var player2;

    beforeEach(function() {
        gameSession = new GameSession();

        player1 = {
            emit: chai.spy()
        };
        player2 = {
            emit: chai.spy()
        };
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
        gameSession.addPlayer(player1);
        gameSession.start();
        gameSession.addPlayer(player2);
        expect(gameSession.players).to.deep.eq([player1]);
    });

    it("allows players to leave", function() {
        gameSession.addPlayer("player1");
        gameSession.removePlayer("player1");
        expect(gameSession.players).to.deep.eq([]);
    });

    it("does not start without players", function() {
        gameSession.start();
        expect(gameSession.hasStarted).to.be.false;
        gameSession.addPlayer(player1);
        gameSession.start();
        expect(gameSession.hasStarted).to.be.true;
    });

    describe("with players", function() {
        var gameSession;
        var player1;
        var player2;

        beforeEach(function() {
            gameSession = new GameSession("1234");

            player1 = {
                emit: chai.spy()
            };
            player2 = {
                emit: chai.spy()
            };

            gameSession.addPlayer(player1);
            gameSession.addPlayer(player2);
            gameSession.start();
        });

        it("remembers who is the current player", function() {
            expect(player1.emit).to.have.been.called().with("guess");
            expect(player2.emit).to.have.been.called().with("wait");
        });

        it("cycles between players", function() {
            gameSession.nextPlayer();
            expect(player1.emit).to.have.been.called().with("wait");
            expect(player2.emit).to.have.been.called().with("guess");
        });

        it("switches to the next player after the current one is removed", function() {
            gameSession.removePlayer(player1);
            expect(player2.emit).to.have.been.called().with("guess");
        });

        it("allows the current player to make a guess", function() {
            gameSession.tryGuess(player1, "2345");
            expect(player1.emit).to.have.been.called().with("found");
        });

        it("tells when someone wins", function() {
            gameSession.tryGuess(player1, "1023");
            gameSession.tryGuess(player2, "1234");

            expect(gameSession.winner).to.eq(player2);
        });
    });
});
