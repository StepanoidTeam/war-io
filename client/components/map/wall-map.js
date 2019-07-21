import { editor } from "../../config.js";

const TYPES = {
  HUMAN: "human",
  ORC: "orc",
};

const STATES = {
  OK: "",
  DAMAGED: "damaged",
  DESTROYED: "destroyed",
};

export class WallMap {
  static TYPES = TYPES;

  constructor(wallTileSet) {
    this.walls = new Map();

    this.wallTileSet = wallTileSet;
  }

  paint(x, y, type = TYPES.HUMAN) {
    const wall = this.getWall(x, y);
    if (!wall || wall !== type) {
      this.setWall(x, y, type);

      this.update();
    }
  }

  erase(x, y) {
    if (this.getWall(x, y)) {
      this.deleteWall(x, y);
    }

    this.update();
  }

  getWall(x, y) {
    const key = `${x}:${y}`;
    return this.walls.get(key);
  }

  setWall(x, y, type = TYPES.HUMAN, state = STATES.OK) {
    const key = `${x}:${y}`;
    return this.walls.set(
      key,
      //do we need to subscribe to neighbors?
      {
        type,
        state,
        x,
        y,
      }
    );
  }

  deleteWall(x, y) {
    const key = `${x}:${y}`;
    return this.walls.delete(key);
  }

  getWallPatternCode(x, y) {
    const currentWall = this.getWall(x, y);

    //clockwize: up right down left
    return [
      currentWall.type,
      currentWall.state,

      [
        this.getWall(x, y - 1),
        this.getWall(x + 1, y),
        this.getWall(x, y + 1),
        this.getWall(x - 1, y),
      ]
        .map(wall => {
          if (!wall) return "0";
          if (wall.type !== currentWall.type) return "0";

          return "x";
        })
        .join(""),
    ]
      .filter(str => str)
      .join("-");
  }

  update() {
    this.walls.forEach(wall => {
      const tileCode = this.getWallPatternCode(wall.x, wall.y);
      //todo: do not update if not changed
      wall.tileCode = tileCode;
    });
  }

  draw(ctx) {
    this.walls.forEach(wall => {
      const tile = this.wallTileSet[wall.tileCode][0];

      ctx.drawImage(
        //todo: get random tile - but not here
        ...tile,
        wall.x * editor.cellSizePx + editor.cellSizePx / 2,
        wall.y * editor.cellSizePx + editor.cellSizePx / 2,
        editor.cellSizePx,
        editor.cellSizePx
      );
    });
  }
}
