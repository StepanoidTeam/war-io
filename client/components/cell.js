import { brushTiles } from "./tile";
import { editor } from "../config";

const { cellSizePx } = editor;

export class Cell {
  constructor({ x, y, cellType }) {
    this.x = x;
    this.y = y;
    this.change(cellType);
  }

  change(cellType) {
    this.cellType = cellType;
    this.tile = brushTiles[cellType];

    this.subscribers.forEach(callback => callback(this));
  }

  subscribers = [];

  onChange(callback) {
    this.subscribers.push(callback);
  }

  draw(ctx) {
    const cellProps = [
      this.x * cellSizePx,
      this.y * cellSizePx,
      cellSizePx,
      cellSizePx,
    ];

    ctx.drawImage(...this.tile, ...cellProps);
  }
}
