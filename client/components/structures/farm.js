import { editor } from "../../config.js";
import { farmTileSet } from "../../common/tilesets/tilesets.js";
import { Structure } from "./structure.js";

export class Farm extends Structure {
  static size = 2;
  constructor(props) {
    super({ ...props, size: Farm.size });

    this.tileCode = "human-farm-done";
  }

  draw(ctx) {
    const tile = farmTileSet[this.tileCode][0];

    ctx.drawImage(
      ...tile,
      this.x * editor.cellSizePx + editor.cellSizePx / 2,
      this.y * editor.cellSizePx + editor.cellSizePx / 2,
      editor.cellSizePx * this.size,
      editor.cellSizePx * this.size
    );
  }

  delete() {}
}
