import { editor, debug } from "../config.js";
import { MapCell } from "./map-cell.js";
import { Cell } from "./cell.js";
import { brushChains } from "../common/brush-chains.js";

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

    if (debug.showCellTypes) {
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
  paintAffectedCells(baseCells, brushCode, skipCells = []) {
    //skip base
    skipCells.push(...baseCells);

    //get near for all?
    const neighborCells = this.getNeighborCellsForMany(baseCells, skipCells);
    //filter affected cells

    const paintedCells = [];
    let newBrushCode = null;
    neighborCells.forEach(cell => {
      skipCells.push(cell);
      if (cell.cellType === brushCode) return; //same color, skip
      const currentChain = brushChains[cell.cellType][brushCode];
      if (currentChain.length <= 2) return; //near color is ok

      //todo: seems here is a 🐛BUG:
      //neighbor cells must be calculated separately for each affected cell,
      //so different newBrushCode should be applied for different cells in wave
      // even wave should be separated into sub-waves by different cell types
      newBrushCode = currentChain[currentChain.length - 2];
      cell.change(newBrushCode);

      paintedCells.push(cell);
    });

    if (paintedCells.length === 0) return;

    this.paintAffectedCells(paintedCells, newBrushCode, skipCells);

    //todo: smells like recursion - refac
  }

  click = (col, row) => {
    //const brushChain = brushChains[editor.brush];

    let selectedCells = [];
    for (let brushRow = 0; brushRow < editor.brushSize; brushRow++) {
      for (let brushCol = 0; brushCol < editor.brushSize; brushCol++) {
        selectedCells.push(this.getCell(col + brushCol, row + brushRow));
      }
    }

    selectedCells = selectedCells.filter(c => c !== null);

    //just paint, 1st iter.
    selectedCells.forEach(c => c.change(editor.brush));
    //paint affected
    this.paintAffectedCells(selectedCells, editor.brush, []);
  };
}
