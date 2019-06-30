import { cellSizePx } from "../config.js";
import { cursorTile, debugTile } from "./tile.js";

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
    ctx.drawImage(
      ...debugTile,
      this.x * cellSizePx - cellSizePx / 2,
      this.y * cellSizePx - cellSizePx / 2,
      cellSizePx * 2,
      cellSizePx * 2
    );
  },
};
