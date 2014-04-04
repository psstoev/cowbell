var chai = require("chai");
var Game = require("../lib/game");
var expect = chai.expect;

describe("Game", function() {
    it("generates a target on initialization", function() {
        var game = new Game();

        expect(game.target).to.be.a("string");
    });

    it("can tell if it was already won by someone", function() {
        var game = new Game("1234");
        var isWon = false;

        game.tryGuess("1234");

        game.on("alreadyWon", function() {
            isWon = true;
        });

        game.tryGuess("5678");

        expect(isWon).to.be.true;
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
        var invalidGuess;

        beforeEach(function() {
            game = new Game();
            invalidGuess = false;

            game.on("invalidGuess", function() {
                invalidGuess = true;
            });
        });

        it("validates length", function() {
            game.tryGuess("1");
            expect(invalidGuess).to.be.true;
        });

        it("validates that the guess does not start with 0", function() {
            game.tryGuess("0123");
            expect(invalidGuess).to.be.true;
        });

        it("validates that the guess contains only unique digits", function() {
            game.tryGuess("1223");
            expect(invalidGuess).to.be.true;
        });

        it("recognizes valid guesses", function() {
            game.tryGuess("1234");
            expect(invalidGuess).to.be.false;
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

        it("triggers 'playerWon' event", function() {
            var game = new Game("1234");
            var isWon = false;

            game.on("playerWon", function() {
                isWon = true;
            });

            game.tryGuess("1234");

            expect(isWon).to.be.true;
        });
    });
});
