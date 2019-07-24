import { editor } from "../../config.js";
import { farmTileSet } from "../../common/tilesets/tilesets.js";
import { Structure } from "./structure.js";

export class Farm extends Structure {
  constructor(props) {
    super(props);

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
