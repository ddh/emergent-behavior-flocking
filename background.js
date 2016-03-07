function Background(game) {
    Entity.call(this, game, 0, 400); // What does "call" do? Constructor?
    //this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.fillStyle = "Black";
    //ctx.fillRect(0, 500, 800, 300);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/8bitbg.png"), 0, 0);
    this.game.ctx.fillText("This is Spaz.", 300, 80);
    this.game.ctx.fillText("He can DANCE!     [idle]", 300, 110);
    this.game.ctx.fillText("He can RUN!         [← →]", 300, 140);
    this.game.ctx.fillText("He can JUMP!       [spacebar]", 300, 170);
    this.game.ctx.fillText("He can't ESCAPE! [wall collisions]", 300, 200);
    this.game.ctx.fillText("'d' to draw collision circles", 300, 230);
    Entity.prototype.draw.call(this);
}