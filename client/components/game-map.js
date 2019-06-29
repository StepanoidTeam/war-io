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

  eachSibling(col, row, brushSize = 1, callback) {
    //neighbour cells
    for (let rowShift = -brushSize; rowShift <= brushSize; rowShift++) {
      for (let colShift = -brushSize; colShift <= brushSize; colShift++) {
        const cell = this.getCell(col + colShift, row + rowShift);
        if (!cell) continue;

        callback(cell, colShift, rowShift, brushSize);
      }
    }
  }
  //todo: concat with above?
  brushSiblings(
    cell,
    sibShiftCol = 0,
    sibShiftRow = 0,
    brushSize = 0,
    currentBrush,
    baseBrushes = []
  ) {
    const code = cell.tileCode.split("");

    for (let tileRow = 0; tileRow <= 1; tileRow++) {
      for (let tileCol = 0; tileCol <= 1; tileCol++) {
        //todo: how to simplify these conditions?
        //bokovushki
        if (sibShiftCol === -brushSize && tileCol === 0) continue;
        if (sibShiftCol === +brushSize && tileCol === 1) continue; //sx=2(t),1
        if (sibShiftRow === -brushSize && tileRow === 0) continue;
        if (sibShiftRow === +brushSize && tileRow === 1) continue;

        const index = tileCol + tileRow * 2;
        //do not overlap basic brush
        if (baseBrushes.includes(code[index])) continue;

        code[index] = currentBrush;
      }
    }

    const tileCode = code.join("");

    //do not change same tile
    //if (cell.tileCode === tileCode) return;

    cell.setTile(tileCode);
  }

  click = event => {
    const { layerX, layerY } = event;

    const col = Math.floor(layerX / cellSizePx);
    const row = Math.floor(layerY / cellSizePx);

    const deps = {
      [editor.brushes.water]: editor.brushes.ice,
      [editor.brushes.snow]: editor.brushes.ice, // editor.brushes.forest],
      [editor.brushes.forest]: editor.brushes.snow,
      // [editor.brushes.rocks]: [editor.brushes.ice],
      // [editor.brushes.ice]: [
      //   editor.brushes.snow,
      //   editor.brushes.water,
      //   editor.brushes.rocks,
      // ],
    };
    //todo: use better naming
    const depBrush = deps[editor.brush];
    if (depBrush) {
      this.eachSibling(col, row, editor.brushSize + 1, (...args) =>
        this.brushSiblings(...args, depBrush, [editor.brush, depBrush])
      );
    }

    //setTimeout(() => {
    //todo: apply selected brush
    this.eachSibling(col, row, editor.brushSize, (...args) =>
      this.brushSiblings(...args, editor.brush)
    );
    // }, 1000);

    //select cell

    //console.log(col, row, index);
  };
}
