var chai = require("chai");
var spies = require("chai-spies");
var expect = chai.expect;

chai.use(spies);

var Player = require("../lib/player");

describe("Player", function() {
    var server;
    
    beforeEach(function() {
        server = {
            createSession: chai.spy(),
        };
    });

    it("can be created with the desired properties", function() {
        var player = new Player("id0", server);

        expect(player.id).to.eq("id0");
        expect(player.server).to.eq(server);
        expect(player.inGame).to.be.false;
    });

    it("can ask the server to create a new game", function() {
        var player = new Player("id0", server);
        player.initiateGame();

        expect(server.createSession).to.have.been.called().with(player);
    });
});
