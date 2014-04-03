var chai = require("chai");
var cowbell = require("../lib/cowbell");
var expect = chai.expect;

describe("getRandomNumber()", function() {
    it("returns a 4-digit number as a string", function() {
        expect(cowbell.getRandomNumber()).to.match(/\d{4}/);
    });

    it("returns a number with unique digits", function() {
        var sortedResult = cowbell.getRandomNumber().split("").sort().join("");

        expect(sortedResult).to.not.match(/(\d)\1+/);
    });

    it("returns a number that does not start with 0", function() {
        expect(cowbell.getRandomNumber()).to.not.match(/^0/);
    });

    it("returns pseudo-random numbers", function() {
        /*
         * NOTE: this test is far from perfect, as it only checks mean values,
         * but it is better than nothing.
         *
         * TODO: move this code in a helper
         */

        var TOTAL_COUNT = 10000;
        var EXPECTED_MEAN = 5450;
        var sum = 0, mean;

        for (var i = 0; i < TOTAL_COUNT; i++) {
            sum += Number(cowbell.getRandomNumber());
        }

        mean = sum / TOTAL_COUNT;

        expect(Math.abs(mean - EXPECTED_MEAN)).to.be.below(100);
    });
});

describe("getCowsForGuess()", function() {
    it("returns 0 for no cows", function() {
        expect(cowbell.getCowsForGuess("1234", "5678")).to.eq(0);
    });

    it("returns the correct number of cows", function() {
        expect(cowbell.getCowsForGuess("1234", "4253")).to.eq(3);
    });
});

describe("getBullsForGuess()", function() {
    it("returns 0 for no bulls", function() {
        expect(cowbell.getBullsForGuess("1234", "5678")).to.eq(0);
    });

    it("returns the correct number of bulls", function() {
        expect(cowbell.getBullsForGuess("1234", "5274")).to.eq(2);
    });

    it("distinguishes betweet bulls and cows", function() {
        expect(cowbell.getBullsForGuess("1234", "4321")).to.eq(0);
    });
});

describe("isGuessValid()", function() {
    it("validates length", function() {
        expect(cowbell.isGuessValid("123")).to.be.false;
        expect(cowbell.isGuessValid("12345")).to.be.false;
    });

    it("validates that the guess does not start with 0", function() {
        expect(cowbell.isGuessValid("0123")).to.be.false;
    });

    it("validates that the guess contains only unique digits", function() {
        expect(cowbell.isGuessValid("1223")).to.be.false;
    });

    it("recognizes valid guesses", function() {
        expect(cowbell.isGuessValid("1234")).to.be.true;
    });
});
