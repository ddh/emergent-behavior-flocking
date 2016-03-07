/**
 * Duy Huynh
 * TCSS 491, Winter '16
 * Assignment 2 - Interaction
 * main.js
 *
 */

var ASSET_MANAGER = new AssetManager();


ASSET_MANAGER.downloadAll(function () {
    console.log("Starting asset downloads");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    ctx.font = "25px Comic Sans MS";

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);

    gameEngine.addEntity(bg);

    gameEngine.init(ctx);
    gameEngine.start();
});
