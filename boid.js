// For randomizing vectors
var SEPARATION_MULTIPLIER = 1.5;
var ALIGNMENT_MULTIPLIER = 0.5;
var COHESION_MULTIPLIER = 0.5;
var SEPARATION_DISTANCE = 25;        // Minimum distance boids are from each other
var ALIGNMENT_DISTANCE = 50;
var COHESION_DISTANCE = 50;
var MAX_SPEED = 2;
var MAX_STEER = 0.05;

function Boid(game, x, y, radius) {
    this.game = game;
    this.ctx = game.ctx;
    this.image = ASSET_MANAGER.getAsset("./img/fish.png");

    // Boid properties
    this.x = x;
    this.y = y;
    this.radius = radius;

    // Boid physics
    this.angle = Math.random() * Math.PI * 2;
    this.position = new Victor(this.x, this.y);
    this.velocity = new Victor(Math.cos(this.angle), Math.sin(this.angle));
    this.acceleration = new Victor(0, 0);

    // Craig Reynold's flocking algorithm
    this.separationVector = new Victor(0, 0);
    this.alignmentVector = new Victor(0, 0);
    this.cohesionVector = new Victor(0, 0);

    Entity.call(this, game, 0, this.y, this.width, this.height);


}

Boid.prototype = new Entity();
Boid.prototype.constructor = Boid;

Boid.prototype.update = function () {
    // First apply flocking algorithms' forces to this boid
    this.applyFlockingRules(this.game.boids);

    // Then update velocity
    this.velocity.add(this.acceleration);

    // Cap speeds at defined limit
    if (this.velocity.x > MAX_SPEED) this.velocity.x = MAX_SPEED;
    if (this.velocity.y > MAX_SPEED) this.velocity.y = MAX_SPEED;

    // Update boid's position
    this.position.add(this.velocity);
    this.x = this.position.x;
    this.y = this.position.y;

    // Update angle

    // Reset acceleration to 0
    this.acceleration.multiplyScalar(0);

    // Check for border wrap-arounds
    if (this.position.x < -this.radius) this.position.x = this.game.surfaceWidth + this.radius;
    if (this.position.y < -this.radius) this.position.y = this.game.surfaceHeight + this.radius;
    if (this.position.x > this.game.surfaceWidth + this.radius) this.position.x = -this.radius;
    if (this.position.y > this.game.surfaceHeight + this.radius) this.position.y = -this.radius;

    Entity.prototype.update.call(this);

};

Boid.prototype.draw = function (ctx) {

    // ctx.drawImage(ASSET_MANAGER.getAsset("./img/fish.png"), this.position.x, this.position.y, 50, 50);

    // TODO: Draw arrows representing separation, alignment, cohesion vectors

    Entity.prototype.draw.call(this, ctx);

};

Boid.prototype.applyFlockingRules = function (boids) {

    // Obtain the three components of Craig Reynold's flocking algorithm:
    this.separationVector = this.separate(boids);
    this.alignmentVector = this.align(boids);
    this.cohesionVector = this.cohesion(boids);

    // Give a weight to the forces
    this.separationVector.multiplyScalar(SEPARATION_MULTIPLIER);
    this.alignmentVector.multiplyScalar(ALIGNMENT_MULTIPLIER);
    this.cohesionVector.multiplyScalar(COHESION_MULTIPLIER);

    // Apply these forces to this boid's acceleration
    this.acceleration.add(this.separationVector);
    this.acceleration.add(this.alignmentVector);
    this.acceleration.add(this.separationVector);

};

Boid.prototype.separate = function (boids) {

    var steer = new Victor(0, 0);   // Final direction the boid wants to steer to
    var neighbors = 0;

    // For each boid, check
    for (var i = 0, len = boids.length; i < len; i++) {

        if (this != boids[i]) { // Ignore self

            // Euclidean distance between this boid and other
            var distance = this.position.distance(boids[i].position);

            // Ignore comparing to self and only consider boids that are too close
            if (distance < SEPARATION_DISTANCE) {

                // Find vector pointing away from other boid
                var oppositeDir = this.position.clone(); // Clone this boid's position
                oppositeDir = oppositeDir.subtract(boids[i].position);

                // Normalize the vector
                oppositeDir.normalize();
                oppositeDir.divideScalar(distance);

                // Add this steer to overall steering vector
                //steer.add(oppositeDir); // TODO: Not sure if this add works
                steer.x += oppositeDir.x;
                steer.y += oppositeDir.y;

                // Increase the number of boids that are too close
                neighbors++;
            }
        }


        // Average the steering vector by number of nearby boids
        if (neighbors > 0) steer.divide(neighbors);

        // If magnitude is great than 0,
        if (steer.magnitude > 0) {
            steer.normalize();
            steer.multiplyScalar(MAX_SPEED);
            steer.subtract(this.velocity);

            // Cap speeds at defined limit
            if (steer.x > MAX_STEER) steer.x = MAX_STEER;
            if (steer.y > MAX_STEER) steer.y = MAX_STEER;
        }

        return steer;

    }
};

// Alignment: Calculate average velocity of neraby birds
Boid.prototype.align = function (boids) {

    var steer = new Victor(0, 0);
    var neighbors = 0;

    // Calculate average velocity of nearby boids
    for (var i = 0, len = boids.length; i < len; i++) {
        if (this != boids[i]) { // Ignore self
            // Euclidean distance between this boid and other
            var distance = this.position.distance(boids[i].position);
            // Ignore comparing to self and only consider boids that are too close
            if (distance < ALIGNMENT_DISTANCE) {
                steer.add(boids[i].velocity);
                neighbors++;
            }
        }
    }

    // Intended steering = desired velocity - boid's velocity
    if (neighbors > 0) {
        steer.divideScalar(neighbors);
        steer.normalize();
        steer.multiplyScalar(MAX_SPEED);
        return steer.subtract(this.velocity);
    } else {
        return new Victor(0, 0);
    }

};

// Steer boid to average location of all boids
Boid.prototype.cohesion = function (boids) {

    // Steering towards average of all boids' location
    var steer = new Victor(0, 0);
    var neighbors = 0;

    // Calculate average velocity of nearby boids
    for (var i = 0, len = boids.length; i < len; i++) {
        if (this != boids[i]) { // Ignore self
            // Euclidean distance between this boid and other
            var distance = this.position.distance(boids[i].position);
            // Ignore comparing to self and only consider boids that are 'neighbors'
            if (distance < COHESION_DISTANCE) {
                steer.add(boids[i].position);
                neighbors++;
            }
        }
    }

    if (neighbors > 0) {
        steer.divideScalar(neighbors);
        return this.steer(steer);
    } else return new Victor(0, 0)
};

// Calculate and apply steering force towards the target vector
Boid.prototype.steer = function (vector) {

    var destination = vector.subtract(this.position);
    destination.normalize();
    destination.multiplyScalar(MAX_SPEED);

    var steer = destination.subtract(this.velocity);
    // Cap speeds at defined limit
    if (steer.x > MAX_STEER) steer.x = MAX_STEER;
    if (steer.y > MAX_STEER) steer.y = MAX_STEER;
    return steer;
};

Boid.prototype.toString = function () {
    return 'Boid';
};