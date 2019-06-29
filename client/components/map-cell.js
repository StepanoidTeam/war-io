import { cellSizePx, debug, editor } from "../config.js";
import { winterTileSet } from "../tilesets.js";
import { debugTile } from "./tile.js";
import { getRandomItem } from "../helpers/random.js";

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
    const { col, row, tile } = this.props;

    const cellProps = [
      col * cellSizePx,
      row * cellSizePx,
      cellSizePx,
      cellSizePx,
    ];

    ctx.drawImage(...tile, ...cellProps);

    if (debug.enabled) {
      ctx.strokeStyle = `rgba(${debug.cellColor})`;
      ctx.strokeRect(...cellProps);

      const fontSize = 14;
      ctx.font = `${fontSize}px Courier New`;
      ctx.fillStyle = "#ffffff";

      ctx.fillText(
        this.tileCode.slice(0, 2),
        col * cellSizePx,
        row * cellSizePx + fontSize * 1
      );
      ctx.fillText(
        this.tileCode.slice(2, 4),
        col * cellSizePx,
        row * cellSizePx + fontSize * 2
      );

      //multi-line support
      // this.debug.split("\n").forEach((part, i) => {
      //   ctx.fillText(
      //     part,
      //     this.x * cellSizePx,
      //     this.y * cellSizePx + fontSize * (i + 1)
      //   );
      // });
    }
  }
}
