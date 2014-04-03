#!/usr/bin/env node

var readline = require("readline");
var Game = require("../lib/game");
var game = new Game();
var gameWon = false;

var readLineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

readLineInterface.setPrompt("Enter your guess: ");
readLineInterface.prompt(true);

readLineInterface.on("line", function(guess) {
    var cows, bulls;

    var result = game.tryGuess(guess);

    if (!result.error) {
        if (result.bulls === 4) {
            gameWon = true;
            readLineInterface.close();
        } else {
            console.log(result.cows + " cows and " + result.bulls + " bulls");
        }
    } else {
        console.log("Invalid guess");
    }

    readLineInterface.prompt(true);
}).on("close", function() {
    if (!gameWon) {
        console.log("\nYou surrendered, the number was " + game.target);
    } else {
        console.log("\nCorrect! The number was " + game.target + ". Bye!");
    }

    process.exit(0);
});
