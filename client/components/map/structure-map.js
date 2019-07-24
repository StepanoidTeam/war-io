import { Wall } from "../structures/wall.js";

export class StructureMap {
  structures = [];

  constructor() {}

  paint(x, y, type = Wall.TYPES.HUMAN) {
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

  setWall(x, y, type = Wall.TYPES.HUMAN, state = Wall.STATES.OK) {
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
