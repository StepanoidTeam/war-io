import { editor } from "../../config.js";

export class WallMap {
  constructor(wallTileSet) {
    this.walls = new Map();

    this.wallTileSet = wallTileSet;
  }

  paint(col, row) {
    if (this.getWall(col, row)) {
      //cell = this.walls.get(key);
    } else {
      this.setWall(col, row);
    }

    this.update();
  }

  getWall(col, row) {
    const key = `${col}:${row}`;
    return this.walls.get(key);
  }

  setWall(col, row) {
    const key = `${col}:${row}`;
    return this.walls.set(
      key,
      //todo: do we need to set tile?
      //do we need to subscibe to neighbors?
      {
        tileCode: "0000",
        col,
        row,
      }
    );
  }

  getWallPatternCode(col, row) {
    //clockwize: up right down left
    return [
      this.getWall(col, row - 1),
      this.getWall(col + 1, row),
      this.getWall(col, row + 1),
      this.getWall(col - 1, row),
    ]
      .map(cell => (cell ? "x" : "0"))
      .join("");
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
