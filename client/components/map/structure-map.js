import { Wall } from "../structures/wall.js";

export class StructureMap {
  structures = [];

  constructor() {}

  //todo: here should be generic paint for any structure
  paint(x, y, $class) {
    const structure = this.getStructure(x, y);
    if (structure) this.erase(structure);

    this.structures.push(
      //do we need to subscribe to neighbors?
      new $class({ x, y })
    );
  }

  erase({ x, y }) {
    if (this.getStructure(x, y)) {
      this.deleteStructure(x, y);
    }
  }

  getStructure(x, y) {
    return this.structures.find(s => s.x === x && s.y === y);
  }

  deleteStructure(x, y) {
    const index = this.structures.findIndex(s => s.x === x && s.y === y);

    if (index < 0) return;

    const [structure] = this.structures.splice(index, 1);
    structure.delete(); //todo: impl delete for structure base class
  }

  draw(ctx) {
    this.structures.forEach(structure => {
      structure.draw(ctx);
    });
  }
}
