//abstract
export class Structure {
  constructor({ x, y, size = 1 }) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  //default 1x1 collider?
  collides({ x, y }) {
    return this.x === x && this.y === y;
  }

  //noop
  delete() {}

  // todo: draw debug pic
  //draw() {}
}
