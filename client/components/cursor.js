import { editor } from "../config.js";
import { cursorTile, debugTile } from "./tile.js";

const { cellSizePx } = editor;
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
      cellSizePx * editor.brushSize,
      cellSizePx * editor.brushSize
    );
  },
};
