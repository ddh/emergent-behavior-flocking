
function Entity(game, x, y, width, height) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
    this.boundingBox = new BoundingBox(x, y, width, height);

}

Entity.prototype.update = function () {
};

// Anything defined here is inherited by all entities (the outline for debugging).
Entity.prototype.draw = function (ctx) {
    if (this.game.enableDebug) {
        this.boundingBox.draw(ctx);
    }
};

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
};

// This code is based on Chris Marriott's Unicorn game found here:
// https://github.com/algorithm0r/GamesProject/blob/Unicorn/game.js

function BoundingBox(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.left = x;
    this.top = y;
    this.right = this.left + width;
    this.bottom = this.top + height;
}

BoundingBox.prototype.collide = function (other) {
    if (this.right > other.left && this.left < other.right && this.top < other.bottom && this.bottom > other.top) return true;
    return false;
};

BoundingBox.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = "green";
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
    ctx.closePath();
};

BoundingBox.prototype.update = function (entity) {

    this.x = entity.x;
    this.y = entity.y;

    this.width = entity.width;
    this.height = entity.height;

    this.left = entity.x;
    this.top = entity.y;
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;

};