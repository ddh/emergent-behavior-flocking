var drawTextWithOutline = function (ctx, font, text, x, y, fillColor, outlineColor, outlineWidth) {
    ctx.font = font;
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = outlineWidth ? outlineWidth : 5;
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 5;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fillColor;
    ctx.fillText(text, x, y);
};