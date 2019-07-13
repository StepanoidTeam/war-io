import { debug } from "../../config.js";
import { TileCell } from "./tile-cell.js";

export class TileMap {
  //todo: do not bind so strictly to surface cells?
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

  init() {
    //subcells for tiles
    for (let tileRow = 0; tileRow < this.size.rows - 1; tileRow++) {
      this.tileCells[tileRow] = [];
      for (let tileCol = 0; tileCol < this.size.cols - 1; tileCol++) {
        const cells = this.getCellsForSub(tileCol, tileRow);

        const subCell = new TileCell({
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

  getCellsForSub(col, row) {
    return [
      this.surfaceTypeCells[row][col],
      this.surfaceTypeCells[row][col + 1],
      this.surfaceTypeCells[row + 1][col],
      this.surfaceTypeCells[row + 1][col + 1],
    ];
  }

  draw(ctx) {
    if (!debug.renderTiles) return;

    for (let row of this.tileCells) {
      for (let subCell of row) {
        subCell.draw(ctx);
      }
    }
  }
}
