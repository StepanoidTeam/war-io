import { Sprite, cellSizePx } from "./sprite.js";

export class TileSprite extends Sprite {
  constructor({
    x,
    y,
    imageName,
    sourcePoint,
    sourceSize,
    sourceOffset,
    debug,
  }) {
    super({ x, y, imageName });

    this.sourcePoint = sourcePoint;
    this.sourceSize = sourceSize;
    this.sourceOffset = sourceOffset;
    this.debug = debug;
  }

  draw(ctx) {
    if (!this.img) return;

    ctx.drawImage(
      this.img,
      //source x,y,w,h
      this.sourcePoint.x * (this.sourceSize + this.sourceOffset),
      this.sourcePoint.y * (this.sourceSize + this.sourceOffset),
      this.sourceSize,
      this.sourceSize,
      //dest x,y,w,h
      this.x * cellSizePx,
      this.y * cellSizePx,
      cellSizePx,
      cellSizePx
    );

    if (this.debug) {
      //return;
      const fontSize = 12;
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = "#ffffff";

      //multi-line support
      this.debug.split("\n").forEach((part, i) => {
        ctx.fillText(
          part,
          this.x * cellSizePx,
          this.y * cellSizePx + fontSize * (i + 1)
        );
      });
    }
  }
}
