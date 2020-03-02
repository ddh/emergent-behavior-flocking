/**
 * Duy Huynh
 * TCSS 491, Winter '16
 * Assignment 3- Network
 * main.js
 *
 * Based on Craig Reynold's flocking algorithms. Based on three behaviors: Separation, Alignment, Cohesion.
 *
 */

// Download Assets
ASSET_MANAGER.queueDownload("./img/fish.png");


ASSET_MANAGER.downloadAll(function () {
    console.log("Starting asset downloads");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    var gameEngine = new GameEngine();

    // Create 100 boids to start off with
    for (var i = 0; i < 100; i++) {
        var boid = new Boid(gameEngine, Math.random() * 800, Math.random() * 600, 2);
        gameEngine.addEntity(boid);
        boids.push(boid); // Careful this 'boids' is not global
    }

    gameEngine.init(ctx);
    gameEngine.start();

    // socket.on("ping", function (ping) {
    //     console.log(ping);
    //     socket.emit("pong");
    // });
});
