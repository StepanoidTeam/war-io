import { editor, debug } from "../../config.js";
import { getRandomItem } from "../../helpers/random.js";
import { surfaceTileSet } from "../../common/tilesets/tilesets.js";
import {
  debugTile,
  buildableTile,
  obstacleTile,
  passableTile,
} from "../tile.js";

const { cellSizePx } = editor;

const obstacles = [
  editor.brushes.forest,
  editor.brushes.rocks,
  editor.brushes.water,
  editor.brushes.waterDark,
];

const noBuild = [...obstacles, editor.brushes.ice, editor.brushes.iceDark];

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

    //update collisions

    this.isObstacle = obstacles.some(b => tileCode.includes(b));
    this.canBuild = !noBuild.some(b => tileCode.includes(b));
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

    if (!debug.showCollides) return;

    ctx.drawImage(
      ...(this.isObstacle
        ? obstacleTile
        : this.canBuild
        ? buildableTile
        : passableTile),
      ...cellProps
    );
  }
}
