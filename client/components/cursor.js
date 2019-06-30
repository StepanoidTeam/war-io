import { cellSizePx } from "../config.js";
import { cursorTile } from "./tile.js";

export const cursor = {
  x: 0,
  y: 0,
  tile: cursorTile,
  move(x, y) {
    this.x = x;
    this.y = y;
  },
  draw(ctx) {
    ctx.drawImage(
      ...this.tile,
      this.x * cellSizePx,
      this.y * cellSizePx,
      cellSizePx,
      cellSizePx
    );
  },
};
