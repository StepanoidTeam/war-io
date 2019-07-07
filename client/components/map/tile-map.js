import { debug } from "../../config.js";
import { MapCell } from "../map-cell.js";

export class TileMap {
  constructor({ surfaceTypeCells }) {
    this.surfaceTypeCells = surfaceTypeCells;

    //todo: make it better?
    this.size = {
      rows: surfaceTypeCells.length,
      cols: surfaceTypeCells[0].length,
    };

    this.tileCells = [];

    this.init();
  }

  getCellsForSub(col, row) {
    return [
      this.surfaceTypeCells[row][col],
      this.surfaceTypeCells[row][col + 1],
      this.surfaceTypeCells[row + 1][col],
      this.surfaceTypeCells[row + 1][col + 1],
    ];
  }

  init() {
    //subcells for tiles
    for (let tileRow = 0; tileRow < this.size.rows - 1; tileRow++) {
      this.tileCells[tileRow] = [];
      for (let tileCol = 0; tileCol < this.size.cols - 1; tileCol++) {
        const cells = this.getCellsForSub(tileCol, tileRow);

        const subCell = new MapCell({
          col: tileCol,
          row: tileRow,
        });

        this.tileCells[tileRow][tileCol] = subCell;

        function updateSubCellTile() {
          const tileCode = cells.map(c => c.cellType).join("");
          subCell.setTile(tileCode);
        }

        cells.forEach(cell => {
          cell.onChange(updateSubCellTile);
        });

        updateSubCellTile();
      }
    } //for
  }

  draw(ctx) {
    if (debug.renderTiles) {
      for (let row of this.tileCells) {
        for (let subCell of row) {
          subCell.draw(ctx);
        }
      }
    }
  }
}
