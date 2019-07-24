export class Unit {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }

  //default 1x1 collider? same as structure? unify
  collides({ x, y }) {
    return this.x === x && this.y === y;
  }
}
