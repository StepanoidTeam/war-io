import { editor } from "../../config.js";
import { wallTileSet } from "../../common/tilesets/tilesets.js";
import { neighborhood } from "../../helpers/neighborhood.js";
import { getRandomItem } from "../../helpers/random.js";

const WALL_TYPES = {
  HUMAN: "human",
  ORC: "orc",
};

const WALL_STATES = {
  OK: "",
  DAMAGED: "damaged",
  DESTROYED: "destroyed",
};

class Wall {
  static TYPES = WALL_TYPES;
  static entries = new Map();

  static getWall({ x, y }) {
    return Wall.entries.get(`${x}:${y}`);
  }

  static updateNeighborhood({ x, y }) {
    neighborhood
      .n4({ x, y })
      .map(Wall.getWall)
      .filter(w => w)
      .forEach(wall => {
        wall.update();
      });
  }

  constructor({ x, y, type, state }) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.health = getRandomItem([0, 50, 100]);

    Wall.entries.set(`${x}:${y}`, this);
    this.update();
  }

  get state() {
    if (this.health === 0) {
      return WALL_STATES.DESTROYED;
    }

    if (this.health > 80) {
      return WALL_STATES.OK;
    }

    return WALL_STATES.DAMAGED;
  }

  delete() {
    Wall.entries.delete(`${this.x}:${this.y}`);
    //todo: update neighbors
    Wall.updateNeighborhood(this);
  }

  update() {
    this.tileCode = this.getWallPatternCode();
  }

  onDelete() {}

  getWallPatternCode() {
    const { x, y, type, state } = this;
    //clockwize: up right down left
    return [
      type,
      state,

      neighborhood
        .n4({ x, y })
        .map(Wall.getWall)
        .map(wall => {
          if (!wall) return "0";
          if (wall.type !== type) return "0";
          //seems destroyed is also have different tile types
          //if (wall.state === WALL_STATES.DESTROYED) return "0";

          return "x";
        })
        .join(""),
    ]
      .filter(str => str)
      .join("-");
  }

  //this is needed only on map load
  updateWallTiles() {
    this.structures
      .filter(s => s instanceof Wall)
      .forEach(wall => {
        const tileCode = this.getWallPatternCode(wall.x, wall.y);
        //todo: do not update if not changed
        wall.tileCode = tileCode;
      });
  }

  draw(ctx) {
    const tile = wallTileSet[this.tileCode][0];

    ctx.drawImage(
      //todo: get random tile - but not here
      ...tile,
      this.x * editor.cellSizePx + editor.cellSizePx / 2,
      this.y * editor.cellSizePx + editor.cellSizePx / 2,
      editor.cellSizePx,
      editor.cellSizePx
    );
  }
}

export class StructureMap {
  static TYPES = WALL_TYPES;

  structures = [];

  constructor() {}

  paint(x, y, type = WALL_TYPES.HUMAN) {
    const structure = this.getStructure(x, y);
    if (structure) this.erase(structure);

    this.setWall(x, y, type);

    Wall.updateNeighborhood({ x, y });
  }

  erase({ x, y }) {
    if (this.getStructure(x, y)) {
      this.deleteStructure(x, y);

      Wall.updateNeighborhood({ x, y });
    }
  }

  getStructure(x, y) {
    return this.structures.find(s => s.x === x && s.y === y);
  }

  setWall(x, y, type = WALL_TYPES.HUMAN, state = WALL_STATES.OK) {
    return this.structures.push(
      //do we need to subscribe to neighbors?
      new Wall({ x, y, type, state })
    );
  }

  deleteStructure(x, y) {
    const index = this.structures.findIndex(s => s.x === x && s.y === y);

    if (index < 0) return;

    const [structure] = this.structures.splice(index, 1);

    if (structure instanceof Wall) {
      structure.delete();
    }
  }

  draw(ctx) {
    this.structures.forEach(structure => {
      structure.draw(ctx);
    });
  }
}
