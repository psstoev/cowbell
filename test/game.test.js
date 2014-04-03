var chai = require("chai");
var Game = require("../lib/game");
var expect = chai.expect;

describe("Game", function() {
    it("generates a target on initialization", function() {
        var game = new Game();

        expect(game.target).to.be.a("string");
    });

    describe("Game.createTargetNumber", function() {
        var createTargetNumber = Game.createTargetNumber;

        it("returns a 4-digit number as a string", function() {
            expect(createTargetNumber()).to.match(/^\d{4}$/);
        });

        it("returns a number with unique digits", function() {
            var sortedResult = createTargetNumber().split("").sort().join("");

            expect(sortedResult).to.not.match(/(\d)\1+/);
        });

        it("returns a number that does not start with 0", function() {
            expect(createTargetNumber()).to.not.match(/^0/);
        });

        it("returns pseudo-random numbers", function() {
            /*
             * NOTE: this test is far from perfect, as it only checks mean values,
             * but it is better than nothing.
             *
             * TODO: move this code in a helper
             */

            var TOTAL_COUNT = 100000;
            var EXPECTED_MEAN = 5450;
            var sum = 0, mean;

            for (var i = 0; i < TOTAL_COUNT; i++) {
                sum += Number(createTargetNumber());
            }

            mean = sum / TOTAL_COUNT;

            expect(Math.abs(mean - EXPECTED_MEAN)).to.be.below(100);
        });
    });

    describe("Game#tryGuess", function() {
        var game;

        before(function() {
            game = new Game();
        });

        it("validates length", function() {
            expect(game.tryGuess("123")).to.have.property("error");
            expect(game.tryGuess("12345")).to.have.property("error");
        });

        it("validates that the guess does not start with 0", function() {
            expect(game.tryGuess("0123")).to.have.property("error");
        });

        it("validates that the guess contains only unique digits", function() {
            expect(game.tryGuess("1223")).to.have.property("error");
        });

        it("recognizes valid guesses", function() {
            expect(game.tryGuess("1234")).to.not.have.property("error");
        });

        it("returns 0 for no cows and 0 for no bulls", function() {
            expect((new Game("1234")).tryGuess("5678")).to.deep.eq({cows: 0, bulls: 0});
        });

        it("returns the correct number of cows", function() {
            expect((new Game("1234")).tryGuess("4523")).to.deep.eq({cows: 3, bulls: 0});
        });

        it("returns the correct number of bulls", function() {
            expect((new Game("1234")).tryGuess("5274")).to.deep.eq({cows: 0, bulls: 2});
        });

        it("distinguishes betweet bulls and cows", function() {
            expect((new Game("1234")).tryGuess("1435")).to.deep.eq({cows: 1, bulls: 2});
        });
    });
});
