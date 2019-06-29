import { cellSizePx, editor } from "../config.js";
import { ctx } from "../context.js";
import { MapCell } from "./map-cell.js";
import { winterTileSet } from "../tilesets.js";
import { getRandomItem } from "../helpers/random.js";

export class GameMap {
  constructor({ size }) {
    this.size = size;

    this.init();
  }

  isDrawing = false;

  init() {
    //todo: hanlde events better
    ctx.canvas.addEventListener("mousedown", () => {
      this.isDrawing = true;
    });

    ctx.canvas.addEventListener("mouseup", () => {
      this.isDrawing = false;
    });

    ctx.canvas.addEventListener("mousemove", event => {
      if (this.isDrawing) this.click(event);
    });

    ctx.canvas.addEventListener("click", event => {
      this.click(event);
    });

    const { rows, cols } = this.size;
    this.cells = [];

    for (let row = 0, index = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++, index++) {
        //
        this.cells.push(
          new MapCell({ col, row, tile: getRandomItem(winterTileSet.snowDay) })
        );
      }
    }
  }

  draw(ctx) {
    this.cells.forEach(c => c.draw(ctx));
  }

  getCell(col, row) {
    if (col >= this.size.cols) return null;
    if (row >= this.size.rows) return null;
    if (col < 0) return null;
    if (row < 0) return null;

    const index = col + this.size.cols * row;
    return this.cells[index];
  }

  eachSibling(col, row, size = 1, callback) {
    //neighbour cells
    for (let rowShift = -size; rowShift <= size; rowShift++) {
      for (let colShift = -size; colShift <= size; colShift++) {
        const cell = this.getCell(col + colShift, row + rowShift);
        if (!cell) continue;

        callback(cell, colShift, rowShift);
      }
    }
  }

  click = event => {
    const { layerX, layerY } = event;

    const col = Math.floor(layerX / cellSizePx);
    const row = Math.floor(layerY / cellSizePx);

    this.eachSibling(
      col,
      row,
      editor.brushSize,
      (cell, sibShiftCol = 0, sibShiftRow = 0) => {
        const code = cell.tileCode.split("");

        for (let tileRow = 0; tileRow <= 1; tileRow++) {
          for (let tileCol = 0; tileCol <= 1; tileCol++) {
            //todo: how to simplify these conditions?
            if (sibShiftCol === -editor.brushSize && tileCol === 0) continue;
            if (sibShiftCol === +editor.brushSize && tileCol === 1) continue; //sx=2(t),1
            if (sibShiftRow === -editor.brushSize && tileRow === 0) continue;
            if (sibShiftRow === +editor.brushSize && tileRow === 1) continue;

            const index = tileCol + tileRow * 2;
            code[index] = editor.brush;
          }
        }

        const tileCode = code.join("");

        cell.setTile(tileCode);
      }
    );

    //select cell

    //console.log(col, row, index);
  };
}
