import { editor, cellSizePx } from "../config.js";

export const cursor = {
  x: 0,
  y: 0,
  move(x, y) {
    this.x = x;
    this.y = y;
  },
  draw(ctx) {
    ctx.strokeStyle = editor.cursorColor;
    ctx.strokeRect(
      this.x * cellSizePx,
      this.y * cellSizePx,
      cellSizePx,
      cellSizePx
    );
  },
};
