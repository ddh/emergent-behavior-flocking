/**
 * Duy Huynh
 * TCSS 491, Winter '16
 * Assignment 2 - Interaction
 * gameengine.js
 *
 */

// Defaulting to browser specific calls to animation frame to future proof:
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})(); // What does it mean to have parenthesis at the end again? It is being called right away?

// Game Engine has entities
function GameEngine() {
    this.entities = [];
    this.boids = [];
    this.enableDebug = false;   // debugging flag for drawing bounding boxes
    this.pauseKey = false;
    this.ctx = null;
    this.click = null;
    this.mouse = null;
    this.wheel = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

/**
 * On creation of GameEngine, create new game Timer, get width & height from canvas, begin recording inputs
 * @param ctx
 */
GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput(); // Allow input controls
    this.timer = new Timer(); // Create game Timer
    console.log('game initialized');
};

/**
 * Begin game.
 */
GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;

    // Create some boids to start out with
    // TODO: Init some boids, for loop, create, random locations

    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
};

/**
 * Begin listening for inputs.
 */
GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;


    /* === KEYBOARD EVENTS === */

    this.ctx.canvas.addEventListener("keydown", function (e) {

        // Prevent some keyboard navigation defaults:
        // http://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser
        if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) e.preventDefault(); // Spacebar, ←,↑,→,↓

        // Debug: Enabling drawing of bounding boxes
        if (e.which === 192) {
            that.enableDebug ^= true; // '~' key to toggle debug
            console.log("debugging turned " + (that.enableDebug ? "on" : "off"));
        }

        // Pauses the game engine's loop()
        if (e.which === 27) {
            that.pauseKey ^= true;
            console.log("Game Engine loop " + (that.pauseKey ? "paused" : "unpaused"));
        }
    }, false);

    /* === MOUSE SETTINGS === */

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

        return {x: x, y: y};
    };

    this.ctx.canvas.addEventListener("mousemove", function (e) {
        //console.log(getXandY(e));
        that.mouse = getXandY(e);
    }, false);

    this.ctx.canvas.addEventListener("click", function (e) {
        //console.log(getXandY(e));
        that.click = getXandY(e);
        var boid = new Boid(that, that.click.x + Math.floor(Math.random() * 100) - 50, that.click.y + Math.floor(Math.random() * 100) - 50, 10);
        that.addEntity(boid);
        that.boids.push(boid);
    }, false);

    this.ctx.canvas.addEventListener("wheel", function (e) {
        //console.log(getXandY(e));
        that.wheel = e;
        //console.log(e.wheelDelta);
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("contextmenu", function (e) {
        //console.log(getXandY(e));
        that.rightclick = getXandY(e);
        e.preventDefault();
    }, false);

    console.log('Input started');
};

/**
 * Push an entity to the GameEngine's array of entities
 * @param entity
 */
GameEngine.prototype.addEntity = function (entity) {
    console.log('added ' + entity);
    this.entities.push(entity);
};

/**
 * Draw entities onto canvas
 */
GameEngine.prototype.draw = function () {

    // 1. Clear the window (Removes previously drawn things from canvas)
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // 2. Save old state
    this.ctx.save();

    // 3. Draw all entities from current scene onto canvas
    //this.sceneManager.draw(this.ctx);
    for (var i = 0, len = this.entities.length; i < len; i++) {
        this.entities[i].draw(this.ctx);
    }

    // 4. Restore old state
    this.ctx.restore();
};

/**
 * Update each entity, removing those flagged for removal.
 */
GameEngine.prototype.update = function () {

    // Cycle through the list of entities in GameEngine.
    var entitiesCount = this.entities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        // Only update those not flagged for removal, for optimization
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    // Removal of flagged entities
    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }
};

/**
 * Basic loop for game.
 * 1. Advance a game 'tick' on the game Timer.
 * 2. Update Game Engine (entities)
 * 3. Draw out to canvas
 * 4. Clear spacebar to prevent repeated firing
 */
GameEngine.prototype.loop = function () {
    if (!this.pauseKey) {
        // 1. Advance game a 'tick' on the game timer
        this.clockTick = this.timer.tick();

        // 2. Update game engine (cycle through all entities)
        this.update();

        // 3. Redraw out to canvas
        this.draw();

        // 4. Reset inputs to prevent repeated firing
        this.click = null;
        this.rightclick = null;
        this.wheel = null;
        this.space = null;
    }

    if (this.pauseKey) {
        drawTextWithOutline(this.ctx, "80pt Impact", "-PAUSED-", this.surfaceWidth / 4, this.surfaceHeight / 2, 'purple', 'white');
    }
};

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now(); // Retrieve current time
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;

    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    //console.log(this.gameTime);
    return gameDelta;
};
