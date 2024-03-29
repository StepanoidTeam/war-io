import { editor } from "../config.js";
import { cursorTile } from "./tile.js";

const { cellSizePx } = editor;

export const cursor = {
  x: 0,
  y: 0,
  tile: cursorTile,
  offset: 0,
  move(x, y) {
    this.x = x;
    this.y = y;
  },
  draw(ctx) {
    ctx.drawImage(
      ...this.tile,
      this.x * cellSizePx + this.offset,
      this.y * cellSizePx + this.offset,
      cellSizePx * editor.brushSize,
      cellSizePx * editor.brushSize
    );
  },
};
