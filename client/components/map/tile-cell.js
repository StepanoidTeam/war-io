import { editor, debug } from "../../config.js";
import { surfaceTileSet } from "../../common/tilesets/tilesets.js";
import { debugTile } from "../tile.js";
import { getRandomItem } from "../../helpers/random.js";

const { cellSizePx } = editor;

export class TileCell {
  constructor(props) {
    this.props = props;

    this.setTile("");
  }

  setTile(tileCode) {
    this.props.tileCode = tileCode;

    this.props.tile = getRandomItem(
      surfaceTileSet[this.props.tileCode] || [debugTile]
    );
  }

  draw(ctx) {
    const { col, row, tile } = this.props;

    const cellProps = [
      col * cellSizePx + cellSizePx / 2,
      row * cellSizePx + cellSizePx / 2,
      cellSizePx,
      cellSizePx,
    ];

    ctx.drawImage(...tile, ...cellProps);

    if (debug.showTileGrid) {
      ctx.drawImage(...debugTile, ...cellProps);
    }
  }
}
