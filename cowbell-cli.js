#!/usr/bin/env node

var readline = require("readline");
var Game = require("./lib/game");
var game = new Game();

var readLineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

game.on("correct", function() {
    console.log("\nCorrect! The number was " + game.target + ". Bye!");
    readLineInterface.close();
}).on("valid", function(result) {
    console.log(result.cows + " cows and " + result.bulls + " bulls");
}).on("invalid", function(guess) {
    console.log("Invalid guess: ", guess);
});

readLineInterface.setPrompt("Enter your guess: ");
readLineInterface.prompt(true);

readLineInterface.on("line", function(guess) {
    game.tryGuess(guess);
    readLineInterface.prompt(true);
}).on("close", function() {
    if (!game.won) {
        console.log("\nYou surrendered, the number was " + game.target);
    }

    process.exit(0);
});
