import { editor } from "../../config.js";
import { farmTileSet } from "../../common/tilesets/tilesets.js";

export class Farm {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;

    this.tileCode = "human-farm-done";
  }

  draw(ctx) {
    const tile = farmTileSet[this.tileCode][0];

    ctx.drawImage(
      ...tile,
      this.x * editor.cellSizePx + editor.cellSizePx / 2,
      this.y * editor.cellSizePx + editor.cellSizePx / 2,
      editor.cellSizePx * 2,
      editor.cellSizePx * 2
    );
  }

  delete() {}
}
