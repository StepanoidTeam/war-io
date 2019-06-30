import { cellSizePx, editor } from "../config.js";
import { ctx } from "../context.js";
import { MapCell } from "./map-cell.js";
import { cursor } from "./cursor.js";

// brush/layer dependency order
const brushChains = {
  [editor.brushes.water]: [
    //editor.brushes.snow, // only forest
    //editor.brushes.ice, // water drops on snow/rocks/.. -> put ice
    editor.brushes.water,
  ],
  [editor.brushes.snow]: [
    //editor.brushes.ice, // if snow drops on water/rocks -> put ice
    editor.brushes.snow,
  ],
  [editor.brushes.forest]: [
    //editor.brushes.ice, // if snow drops on rocks/water -> put ice
    //editor.brushes.snow, //?
    editor.brushes.forest,
  ],

  [editor.brushes.ice]: [
    //editor.brushes.snow, //if ice drops on forest -> put snow
    editor.brushes.ice,
  ],
  [editor.brushes.rocks]: [
    //editor.brushes.snow, // if ice drops on forest -> put snow
    //editor.brushes.ice, //?
    editor.brushes.rocks,
  ],
};

export class GameMap {
  constructor({ size }) {
    this.size = size;

    this.init();
  }

  init() {
    let isDrawing = false;
    //todo: hanlde events better - move to index?
    ctx.canvas.addEventListener("mousedown", () => {
      isDrawing = true;
    });

    ctx.canvas.addEventListener("mouseup", () => {
      isDrawing = false;
    });

    ctx.canvas.addEventListener("mousemove", event => {
      const { layerX, layerY } = event;

      const col = Math.floor(layerX / cellSizePx);
      const row = Math.floor(layerY / cellSizePx);

      if (isDrawing) this.click(col, row);

      cursor.move(col, row);
    });

    ctx.canvas.addEventListener("click", event => {
      const { layerX, layerY } = event;

      const col = Math.floor(layerX / cellSizePx);
      const row = Math.floor(layerY / cellSizePx);

      this.click(col, row);
    });

    //init map with default tile cells
    const { rows, cols } = this.size;
    this.cells = [];

    for (let row = 0, index = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++, index++) {
        this.cells.push(
          new MapCell({ col, row, tileCode: editor.defaultTileCode })
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
    const code = cell.props.tileCode.split("");

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
    //if (cell.props.tileCode === tileCode) return;

    cell.setTile(tileCode);
  }

  click = (col, row) => {
    const brushChain = brushChains[editor.brush];

    brushChain.forEach((brush, index, { length }) => {
      const size = length - index - 1 + editor.brushSize;

      this.eachCellInArea(col, row, size, (...args) =>
        this.paintCell(...args, brush, brushChain.slice(index))
      );
    });
    //todo: steps:
    //1. paint clicked cell parts with brush 1
    //2. get affected neigbour cell parts inlc. diags - shifted cells?
    //3. paint those with brush 1
    //4. get affected neighbour cell parts incl. diags - shifted cells?
    //5. if they do not meet new brush - replace them with brush 2
    //6.

    //new approach:
    //1. put 1x1 2x2 3x3 shifted cells (not mapcells)
    //2. get replaced cell neighbours - check whether they ok to be near brush 1
    //3. if not - replace them with brush 2, goto step2

    //console.log(col, row, index);
  };
}
