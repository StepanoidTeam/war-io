import { Peasant } from "../common/tilesets/units/peasant.js";

const units = [
  new Peasant({ x: 1, y: 1, animation: "walk-up" }),
  new Peasant({ x: 4, y: 4, animation: "walk-right" }),
  new Peasant({ x: 10, y: 4, animation: "hatch-up" }),
  new Peasant({ x: 4, y: 11, animation: "die-up" }),
];

export const unitsMap = {
  units,
  getUnitIndex(x, y) {
    const unitIndex = this.units.findIndex(u => u.collides({ x, y }));
    return unitIndex;
  },
  collides({ x, y, size }) {
    return this.units.some(s => s.collides({ x, y, size }));
  },
  getUnit({ x, y }) {
    return this.units.find(u => u.collides({ x, y }));
  },
  paint(x, y, $class) {
    this.deleteUnit({ x, y });

    this.units.push(new $class({ x, y, animation: "walk-up" }));
  },
  deleteUnit({ x, y }) {
    const index = this.units.findIndex(s => s.collides({ x, y }));

    if (index < 0) return;

    const [unit] = this.units.splice(index, 1);
    unit.delete(); //todo: impl delete for unit base class
  },
  draw(ctx) {
    this.units.forEach(u => u.draw(ctx));
  },
};
