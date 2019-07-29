export class StructureMap {
  structures = [];

  constructor() {}

  getStructure({ x, y }) {
    return this.structures.find(u => u.collides({ x, y }));
  }

  collides({ x, y, size }) {
    return this.structures.some(s => s.collides({ x, y, size }));
  }

  //todo: here should be generic paint for any structure
  paint(x, y, $class) {
    //todo: should find and delete all, not 1
    //this.deleteStructure({ x, y, size: $class.size });

    this.structures.push(
      //do we need to subscribe to neighbors?
      new $class({ x, y })
    );
  }

  deleteStructure({ x, y, size }) {
    const index = this.structures.findIndex(s => s.collides({ x, y, size }));

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
