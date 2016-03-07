function Boid(game, x, y, width, height) {
    this.game = game;
    this.ctx = game.ctx;

    // Boid properties
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // Boid physics
    this.position = {x: this.x, y: this.y};
    this.velocity = {x: 0, y: 0};
    this.acceleration = {x: 0, y: 0};
    this.maxSteer = 0.05;                   // Maximum steering
    this.maxSpeed = 2;                      // Maximum speed


    Entity.call(this, game, 0, this.y, this.width, this.height);


}

Boid.prototype.update = function () {
};

// Anything defined here is inherited by all entities (the outline for debugging).
Boid.prototype.draw = function (ctx) {

};
