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
        this.emit("invalidGuess", guess);
        return;
    } else if (this.won) {
        this.emit("alreadyWon");
        return;
    }

    var result = Game.getCowsAndBulls(this.target, guess);

    if (result.bulls === 4) {
        this.won = true;
        this.emit("playerWon", result);
    } else {
        this.emit("foundCowsAndBulls", result);
    }

    return result;
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
    var DIGITS = "0123456789".split("");
    var result = DIGITS.slice();

    /*
     * Shuffle the string using Fisher-Yates shuffle.
     * see http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
     */
    DIGITS.forEach(function(digit, index) {
        var randomIndex = Math.floor(Math.random() * (index + 1));

        if (randomIndex !== index) {
            result[index] = result[randomIndex];
        }

        result[randomIndex] = digit;
    });

    if (result[0] === "0") {
        result[0] = result[9]; // Discard the "0" if it is in the beggining
    }

    return result.slice(0, 4).join("");
};

module.exports = Game;
