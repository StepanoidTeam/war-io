import { cellSizePx, editor } from "../config.js";
import { ctx } from "../context.js";
import { MapCell } from "./map-cell.js";
import { winterTileSet } from "../tilesets.js";
import { getRandomItem } from "../helpers/random.js";

// brush/layer dependency order
const brushChains = {
  [editor.brushes.water]: [
    editor.brushes.snow,
    editor.brushes.ice,
    editor.brushes.water,
  ],
  [editor.brushes.snow]: [editor.brushes.ice, editor.brushes.snow],
  [editor.brushes.forest]: [
    editor.brushes.ice,
    editor.brushes.snow,
    editor.brushes.forest,
  ],
  // [editor.brushes.rocks]: [editor.brushes.ice],
  [editor.brushes.ice]: [
    // editor.brushes.water, //2
    // editor.brushes.snow, //these two are same prior, how to handle that?
    editor.brushes.ice,
  ],
};

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

  eachCellInArea(col, row, areaSize = 1, callback) {
    //neighbour cells
    for (let rowShift = -areaSize; rowShift <= areaSize; rowShift++) {
      for (let colShift = -areaSize; colShift <= areaSize; colShift++) {
        const cell = this.getCell(col + colShift, row + rowShift);
        if (!cell) continue;

        callback(cell, colShift, rowShift, areaSize);
      }
    }
  }
  //todo: concat with above?
  paintCell(
    cell,
    sibShiftCol = 0,
    sibShiftRow = 0,
    areaSize = 0,
    currentBrush,
    brushesToSkip = []
  ) {
    const code = cell.tileCode.split("");

    for (let tileRow = 0; tileRow <= 1; tileRow++) {
      for (let tileCol = 0; tileCol <= 1; tileCol++) {
        //todo: how to simplify these conditions?
        //bokovushki
        if (sibShiftCol === -areaSize && tileCol === 0) continue;
        if (sibShiftCol === +areaSize && tileCol === 1) continue; //sx=2(t),1
        if (sibShiftRow === -areaSize && tileRow === 0) continue;
        if (sibShiftRow === +areaSize && tileRow === 1) continue;

        const index = tileCol + tileRow * 2;
        //do not overlap basic brush
        if (brushesToSkip.includes(code[index])) continue;

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

    const brushChain = brushChains[editor.brush];

    brushChain.forEach((brush, index, { length }) => {
      const size = length - index - 1 + editor.brushSize;

      this.eachCellInArea(col, row, size, (...args) =>
        this.paintCell(...args, brush, brushChain.slice(index))
      );
    });

    //console.log(col, row, index);
  };
}
