import { editor } from "../../config.js";
import { Structure } from "./structure.js";
import { goldMineTileSet } from "../../common/tilesets/structures/gold-mine.js";

export class GoldMine extends Structure {
  static size = 3;
  static icon = goldMineTileSet["winter-gold-mine-active"][0];
  constructor(props) {
    super({ ...props, size: GoldMine.size });

    this.tileCode = "winter-gold-mine";
  }

  draw(ctx) {
    const tile = goldMineTileSet[this.tileCode][0];

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
