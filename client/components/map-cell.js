import { editor, debug } from "../config.js";
import { winterTileSet } from "../common/tilesets.js";
import { debugTile } from "./tile.js";
import { getRandomItem } from "../helpers/random.js";

const { cellSizePx } = editor;

export class MapCell {
  constructor(props) {
    this.props = props;

    this.setTile(props.tileCode);
  }

  setTile(tileCode) {
    this.props.tileCode = tileCode;

    this.props.tile = getRandomItem(
      winterTileSet[this.props.tileCode] || [debugTile]
    );
  }

  draw(ctx) {
    const { col, row, tile, tileCode } = this.props;

    const cellProps = [
      col * cellSizePx + cellSizePx / 2,
      row * cellSizePx + cellSizePx / 2,
      cellSizePx,
      cellSizePx,
    ];

    ctx.drawImage(...tile, ...cellProps);

    const isMissingTile = this.props.tile === debugTile;

    // if (debug.showBrushMarkers || isMissingTile) {
    //   const halfSizePx = cellSizePx / 2;
    //   for (let codeCol = 0; codeCol <= 1; codeCol++) {
    //     for (let codeRow = 0; codeRow <= 1; codeRow++) {
    //       const index = codeCol + codeRow * 2;

    //       ctx.drawImage(
    //         ...brushTiles[tileCode[index]],
    //         col * cellSizePx + codeCol,
    //         row * cellSizePx + codeRow,
    //         halfSizePx,
    //         halfSizePx
    //       );
    //     }
    //   }
    // }

    if (debug.showTileGrid) {
      ctx.drawImage(...debugTile, ...cellProps);
    }
  }
}
