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
  paintCells(
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

  getNeighborCells({ x, y }) {
    const nCells = [];

    for (let rowShift = -1; rowShift <= 1; rowShift++) {
      for (let colShift = -1; colShift <= 1; colShift++) {
        const nCell = this.getCell(x + colShift, y + rowShift);
        if (!nCell) continue; //not exist
        nCells.push(nCell);
      }
    }

    return nCells;
  }

  //todo: mb this could be calculated once on init, and saved as prop
  getNeighborCellsForMany(basicCells, skipCells) {
    const nCells = new Set(
      basicCells.map(bCell => this.getNeighborCells(bCell)).flat()
    );

    skipCells.forEach(sCell => nCells.delete(sCell));

    return [...nCells];
  }

  //todo: rename color to something better
  paintCells(cells, color, skipCells = []) {
    //1 - paint all?
    cells.forEach(c => c.change(color));

    skipCells.push(...cells);

    //2 - get near for all?
    const nCells = this.getNeighborCellsForMany(cells, skipCells);
    //3 - filter
    const cellsToRepaint = nCells.filter(nCell => {
      //same color
      // if (nCell.cellType === editor.brush) return;
      //not bad/bad color
      return !brushChains[color].includes(nCell.cellType);
      //goto step
    });

    if (cellsToRepaint.length === 0) return skipCells;
    //todo: smells like recursion - refac
    return this.paintCells(cellsToRepaint, brushChains[color][0], skipCells);
  }

  click = (col, row) => {
    //const brushChain = brushChains[editor.brush];

    const selectedCells = [];
    for (let brushRow = 0; brushRow < editor.brushSize; brushRow++) {
      for (let brushCol = 0; brushCol < editor.brushSize; brushCol++) {
        selectedCells.push(this.getCell(col + brushCol, row + brushRow));
      }
    }

    const affectedCells = this.paintCells(selectedCells, editor.brush, []);
    console.log(affectedCells.length);
    //todo:
    //clear marked as repaint

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
