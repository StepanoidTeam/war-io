import { editor, debug } from "../config.js";
import { MapCell } from "./map-cell.js";
import { Cell } from "./cell.js";
import { brushChains } from "../common/index.js";
import { ctx } from "../context.js";

export class GameMap {
  constructor({ size }) {
    this.size = size;

    this.init();

    //todo: extract as separate component
    this.miniMapCtx = document.createElement("canvas").getContext("2d");

    this.miniMapCtx.canvas.width = 100;
    this.miniMapCtx.canvas.height = 100;

    document.body.appendChild(this.miniMapCtx.canvas);
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
  paintCells(cells, color, skipCells = []) {
    //1 - paint all?
    cells.forEach(c => c.change(color));

    skipCells.push(...cells);

    //2 - get near for all?
    const nCells = this.getNeighborCellsForMany(cells, skipCells);
    //3 - filter
    const cellsToRepaint = nCells.filter(nCell => {
      //same color
      //not bad/bad color
      return !brushChains[color].includes(nCell.cellType);
    });

    if (cellsToRepaint.length === 0) return;
    //todo: smells like recursion - refac
    this.paintCells(cellsToRepaint, brushChains[color][0], skipCells);
  }

  click = (col, row) => {
    //const brushChain = brushChains[editor.brush];

    const selectedCells = [];
    for (let brushRow = 0; brushRow < editor.brushSize; brushRow++) {
      for (let brushCol = 0; brushCol < editor.brushSize; brushCol++) {
        selectedCells.push(this.getCell(col + brushCol, row + brushRow));
      }
    }

    this.paintCells(selectedCells.filter(c => c !== null), editor.brush, []);

    //new approach:
    //1. put 1x1 2x2 3x3 shifted cells (not mapcells)
    //2. get replaced cell neighbours - check whether they ok to be near brush 1
    //3. if not - replace them with brush 2, goto step2

    //debug
    this.drawMinimap();
  };

  drawMinimap() {
    this.miniMapCtx.drawImage(
      ctx.canvas,
      0,
      0,
      this.miniMapCtx.canvas.width,
      this.miniMapCtx.canvas.height
    );
  }
}
