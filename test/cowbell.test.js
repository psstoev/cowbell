var chai = require("chai");
var expect = chai.expect;
var cowbell = require("../lib/cowbell");

describe("getRandomNumber()", function() {
    it("returns 1", function() {
        expect(cowbell.getRandomNumber()).to.eq(1);
    });
});
