import { Point } from "./point.js";

export const cellSizePx = 32;

export class Sprite extends Point {
  constructor({ x, y, image }) {
    super({ x, y });

    this.img = image;
  }

  move({ x, y }) {
    super.x = x;
    super.y = y;
  }

  draw(ctx) {
    if (!this.img) return;

    ctx.drawImage(
      this.img,

      this.x * cellSizePx,
      this.y * cellSizePx,
      this.img.width,
      this.img.height
    );
  }
}
