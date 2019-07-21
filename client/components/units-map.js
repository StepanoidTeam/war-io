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
    const unitIndex = this.units.findIndex(u => u.x === x && u.y === y);
    return unitIndex;
  },
  getUnit(x, y) {
    return this.units.find(u => u.x === x && u.y === y);
  },
  paint({ x, y, unit }) {
    if (tileMap.tileCells[y][x].isObstacle) return;

    const unitIndex = this.getUnitIndex(x, y);
    if (unitIndex < 0)
      this.units.push(new unit({ x, y, animation: "walk-up" }));
  },
  erase(x, y) {
    const unitIndex = this.getUnitIndex(x, y);
    if (unitIndex >= 0) this.units.splice(unitIndex, 1);
  },
  draw(ctx) {
    this.units.forEach(u => u.draw(ctx));
  },
};
