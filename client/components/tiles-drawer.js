import { winterTileSet } from "../common/tilesets.js";
import { editor } from "../config.js";

//debug: to draw all used tiles from tileset
export const tilesDrawer = {
  tiles: Object.entries(winterTileSet),
  draw(ctx) {
    let x = 0,
      y = 0;
    this.tiles.forEach(([, tileGroup], groupIndex) => {
      Object.values(tileGroup).forEach((tile, index) => {
        ctx.drawImage(
          ...tile,
          x * editor.cellSizePx,
          y * editor.cellSizePx,
          editor.cellSizePx,
          editor.cellSizePx
        );

        x++;
        if (x >= 20) {
          x = 0;
          y++;
        }
      });
    });
  },
};
