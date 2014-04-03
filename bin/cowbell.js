#!/usr/bin/env node

var readline = require("readline");
var cowbell = require("../lib/cowbell");
var target = cowbell.getRandomNumber();

var readLineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log("Hello! Guess my number!");
readLineInterface.setPrompt("Enter your guess: ");
readLineInterface.prompt(true);

readLineInterface.on("line", function(guess) {
    var cows, bulls;

    if (cowbell.isGuessValid(guess)) {
        cows = cowbell.getCowsForGuess(target, guess);
        bulls = cowbell.getBullsForGuess(target, guess);

        if (bulls === 4) {
            console.log("Correct!");
            readLineInterface.close();
        } else {
            console.log(cows + " cows and " + bulls + " bulls");
        }
    } else {
        console.log("Invalid guess");
    }

    readLineInterface.prompt(true);
}).on("close", function() {
    console.log("Bye!");
    process.exit(0);
});
