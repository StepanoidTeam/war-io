import { Point } from "./point.js";
import { getImage } from "../helpers/get-image.js";

export const cellSizePx = 32;

const imageLib = new Map();

export class Sprite extends Point {
  constructor({ x, y, imageName }) {
    super({ x, y });

    this.init({ imageName });
  }

  async init({ imageName }) {
    if (!imageLib.has(imageName)) {
      imageLib.set(imageName, await getImage(imageName));
    }
    this.img = imageLib.get(imageName);
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
