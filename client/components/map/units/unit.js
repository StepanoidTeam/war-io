export function intersect([ax, awidth], [bx, bwidth]) {
  return ax <= bx + bwidth && ax + awidth >= bx;
}

//abstract
export class Unit {
  static size = 1; //default
  constructor({ x, y, size = Unit.size }) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  collides({ x, y, size = 1 }) {
    // aabb
    const result =
      intersect([x, size - 1], [this.x, this.size - 1]) &&
      intersect([y, size - 1], [this.y, this.size - 1]);

    return result;
  }

  //noop
  delete() {}

  // todo: draw debug pic
  //draw() {}
}
