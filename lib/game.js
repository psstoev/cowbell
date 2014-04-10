var events = require("events");
var util = require("util");

var LENGTH_REGEX = /^\d{4}$/;
var DUPLICATE_REGEX = /(\d)\1+/;

function Game(target) {
    this.target = target || Game.createTargetNumber();
    this.won = false;
}

util.inherits(Game, events.EventEmitter);

Game.prototype.tryGuess = function(guess) {
    if (!Game.isGuessValid(guess)) {
        this.emit("invalid", guess);
        return;
    } else if (this.won) {
        this.emit("won");
        return;
    }

    var result = Game.getCowsAndBulls(this.target, guess);

    result.guess = guess;

    if (result.bulls === 4) {
        this.won = true;
        this.emit("correct", result);
    } else {
        this.emit("valid", result);
    }
};

Game.getCowsAndBulls = function(target, guess) {
    var cows = 0;
    var bulls = 0;

    for (var i = 0; i < target.length; i++) {
        for (var j = 0; j < guess.length; j++) {
            if (target[i] === guess[j]) {
                if (i !== j) {
                    cows++;
                } else {
                    bulls++;
                }
            }
        }
    }

    return {
        cows: cows,
        bulls: bulls,
    };
};

Game.isGuessValid = function(guess) {
    if (guess.match(LENGTH_REGEX) === null || guess[0] === "0") {
        return false;
    }

    var sortedDigits = guess.split("").sort().join("");

    if (sortedDigits.match(DUPLICATE_REGEX)) {
        return false;
    }

    return true;
};

Game.createTargetNumber = function() {
    // Start at a random digit, different from 0 and get the next three
    // by adding 3 modulo 10, so we are safe from duplicate digits:
    var digit = Math.floor(Math.random() * 10) || 1;

    return "" + digit + (digit + 3) % 10 + (digit + 6) % 10 + (digit + 9) % 10;
};

module.exports = Game;
