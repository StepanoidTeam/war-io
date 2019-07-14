import { editor } from "../../config.js";

const TYPES = {
  HUMAN: "hum",
  ORC: "orc",
};

export class WallMap {
  static TYPES = TYPES;

  constructor(wallTileSet) {
    this.walls = new Map();

    this.wallTileSet = wallTileSet;
  }

  paint(col, row, type = TYPES.HUMAN) {
    const wall = this.getWall(col, row);
    if (!wall || wall !== type) {
      this.setWall(col, row, type);

      this.update();
    }
  }

  erase(col, row) {
    if (this.getWall(col, row)) {
      this.deleteWall(col, row);
    }

    this.update();
  }

  getWall(col, row) {
    const key = `${col}:${row}`;
    return this.walls.get(key);
  }

  setWall(col, row, type = TYPES.HUMAN) {
    const key = `${col}:${row}`;
    return this.walls.set(
      key,
      //do we need to subscribe to neighbors?
      {
        type,
        col,
        row,
      }
    );
  }

  deleteWall(col, row) {
    const key = `${col}:${row}`;
    return this.walls.delete(key);
  }

  getWallPatternCode(col, row) {
    const currentWall = this.getWall(col, row);

    //clockwize: up right down left
    return (
      currentWall.type +
      "-" +
      [
        this.getWall(col, row - 1),
        this.getWall(col + 1, row),
        this.getWall(col, row + 1),
        this.getWall(col - 1, row),
      ]
        .map(wall => {
          if (!wall) return "0";
          if (wall.type !== currentWall.type) return "0";

          return "x";
        })
        .join("")
    );
  }

  update() {
    this.walls.forEach(wall => {
      const tileCode = this.getWallPatternCode(wall.col, wall.row);
      //todo: do not update if not changed
      wall.tileCode = tileCode;
    });
  }

  draw(ctx) {
    this.walls.forEach(wall =>
      ctx.drawImage(
        //todo: get random tile - but not here
        ...this.wallTileSet[wall.tileCode][0],
        wall.col * editor.cellSizePx + editor.cellSizePx / 2,
        wall.row * editor.cellSizePx + editor.cellSizePx / 2,
        editor.cellSizePx,
        editor.cellSizePx
      )
    );
  }
}
