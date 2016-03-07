/**
 * Duy Huynh
 * TCSS 491, Winter '16
 * Assignment 2 - Interaction
 * main.js
 *
 * Based on Craig Reynold's flocking algorithms. Based on three behaviors: Separation, Alignment, Cohesion.
 *
 */

ASSET_MANAGER.queueDownload("./img/bg-space.png");


ASSET_MANAGER.downloadAll(function () {
    console.log("Starting asset downloads");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    ctx.font = "25px Impact";

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/bg-space.png"), 800, 600);

    gameEngine.addEntity(bg);

    gameEngine.init(ctx);
    gameEngine.start();
});
