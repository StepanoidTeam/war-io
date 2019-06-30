import { editor, debug } from "../config.js";
import { brushTiles } from "./tile.js";
import { MapCell } from "./map-cell.js";

const { cellSizePx } = editor;
// brush/layer dependency order
const brushChains = {
  [editor.brushes.water]: [
    editor.brushes.ice, // water drops on snow/rocks/.. -> put ice
    //editor.brushes.snow, // only forest
    editor.brushes.water,
  ],
  [editor.brushes.snow]: [
    editor.brushes.ice,
    //editor.brushes.ice, // if snow drops on water/rocks -> put ice
    editor.brushes.snow,
    editor.brushes.forest,
  ],
  [editor.brushes.forest]: [
    editor.brushes.snow, //?
    //editor.brushes.ice, // if snow drops on rocks/water -> put ice
    editor.brushes.forest,
  ],

  [editor.brushes.ice]: [
    editor.brushes.snow, //if ice drops on forest -> put snow
    editor.brushes.water,
    editor.brushes.rocks,
    editor.brushes.ice,
  ],
  [editor.brushes.rocks]: [
    editor.brushes.ice, //?
    //editor.brushes.snow, // if ice drops on forest -> put snow
    editor.brushes.rocks,
  ],
};

class Cell {
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

export class GameMap {
  constructor({ size }) {
    this.size = size;

    this.init();
  }

  init() {
    //init map with default tile cells
    const { rows, cols } = this.size;
    this.cells = [];
    this.subCells = [];

    //cells for main types info
    for (let row = 0, index = 0; row < rows; row++) {
      this.cells[row] = [];
      for (let col = 0; col < cols; col++, index++) {
        this.cells[row][col] = new Cell({
          x: col,
          y: row,
          cellType: editor.brushes.snow,
        });
        //new MapCell({ col, row, tileCode: editor.defaultTileCode }),
      }
    } //for

    //subcells for tiles
    for (let subRow = 0; subRow < this.size.rows - 1; subRow++) {
      this.subCells[subRow] = [];
      for (let subCol = 0; subCol < this.size.cols - 1; subCol++) {
        const cells = this.getCellsForSub(subCol, subRow);

        const tileCode = cells.map(c => c.cellType).join("");

        const subCell = new MapCell({
          col: subCol,
          row: subRow,
          tileCode,
        });

        cells.forEach(cell => {
          cell.onChange(cell => {
            const tileCode = cells.map(c => c.cellType).join("");
            subCell.setTile(tileCode);
          });
        });

        this.subCells[subRow][subCol] = subCell;
      }
    } //for
  }

  getCellsForSub(subCol, subRow) {
    return [
      this.cells[subRow][subCol],
      this.cells[subRow][subCol + 1],
      this.cells[subRow + 1][subCol],
      this.cells[subRow + 1][subCol + 1],
    ];
  }

  draw(ctx) {
    //tiles
    if (debug.renderTiles) {
      for (let row of this.subCells) {
        for (let subCell of row) {
          subCell.draw(ctx);
        }
      }
    }

    if (debug.showCells) {
      //main cells
      for (let row of this.cells) {
        for (let cell of row) {
          cell.draw(ctx);
        }
      }
    }
  }

  getCell(col, row) {
    if (col >= this.size.cols) return null;
    if (row >= this.size.rows) return null;
    if (col < 0) return null;
    if (row < 0) return null;

    return this.cells[row][col];
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

  //todo: mb this could be calculated once on init, and saved as prop
  getNeighborCells({ x, y }) {
    const result = [];
    for (let rowShift = -1; rowShift <= 1; rowShift++) {
      for (let colShift = -1; colShift <= 1; colShift++) {
        if (rowShift === 0 && colShift === 0) continue; //same
        const nCell = this.getCell(x + colShift, y + rowShift);
        if (!nCell) continue; //not exist

        result.push(nCell);
      }
    }

    return result;
  }

  paintCell(cell) {}

  click = (col, row) => {
    //const brushChain = brushChains[editor.brush];

    const selectedCell = this.cells[row][col];

    //1 - paint
    selectedCell.change(editor.brush);
    //2 - get near
    const nCells = this.getNeighborCells(selectedCell);
    //3 - filter?

    nCells.forEach(nCell => {
      //same color
      if (nCell.cellType === editor.brush) return;
      if (!brushChains[editor.brush].includes(nCell.cellType)) {
        nCell.change(brushChains[editor.brush][0]);
      }
    });

    // brushChain.forEach((brush, index, { length }) => {
    //   const size = length - index - 1 + editor.brushSize;

    //   this.eachCellInArea(col, row, size, (...args) =>
    //     this.paintCell(...args, brush, brushChain.slice(index))
    //   );
    // });
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
