var LENGTH_REGEX = /^\d{4}$/;
var DUPLICATE_REGEX = /(\d)\1+/;

function Game(target) {
    this.target = target || Game.createTargetNumber();
}

Game.prototype.tryGuess = function(guess) {
    var cows = 0;
    var bulls = 0;
    var target = this.target;

    if (!Game.isGuessValid(guess)) {
        return {
            error: "Invalid guess",
        };
    }

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
}

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
