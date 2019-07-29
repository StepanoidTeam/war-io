import { loadTileSet } from "../tilesets.js";
import { editor } from "../../../config.js";

const goldMine = {
  ["winter-gold-mine"]: [1],
  ["winter-gold-mine-active"]: [4],
};

export const goldMineTileSet = Object.entries(goldMine).reduce(
  (acc, [key, ranges]) => {
    acc[key] = loadTileSet({
      imageName: "structures/gold-mine.png",
      ranges,
      imgSetConfig: {
        sourceSize: editor.cellSizePx * 3,
        sourceOffset: 0,
        cols: 3,
        rows: 2,
      },
    });

    return acc;
  },
  {}
);
