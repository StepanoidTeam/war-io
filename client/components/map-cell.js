import { cellSizePx, debug } from "../config.js";
import { winterTileSet } from "../tilesets.js";

export class MapCell {
  constructor(props) {
    this.props = props;

    this.setTile(0b0000);
  }

  setTile(tileCode = 0b0000) {
    this.tileCode = tileCode;

    this.props.tile = winterTileSet.snowIce[this.tileCode]();
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
    }

    // if (this.debug) {
    //   //return;
    //   const fontSize = 12;
    //   ctx.font = `${fontSize}px Arial`;
    //   ctx.fillStyle = "#ffffff";

    //   //multi-line support
    //   this.debug.split("\n").forEach((part, i) => {
    //     ctx.fillText(
    //       part,
    //       this.x * cellSizePx,
    //       this.y * cellSizePx + fontSize * (i + 1)
    //     );
    //   });
    // }
  }
}
