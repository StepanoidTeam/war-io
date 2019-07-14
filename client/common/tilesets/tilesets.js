import { Tile } from "../../components/tile.js";
import { editor, IMAGESETS } from "../../config.js";
import { winter, winterWalls } from "./winter.js";

const { cellSizePx } = editor;

const defaultImgSetConfig = {
  sourceSize: cellSizePx,
  sourceOffset: 1,
  cols: 19,
  rows: 20,
};

export function loadTiles({
  imageName,
  from,
  to,
  imgSetConfig = defaultImgSetConfig,
}) {
  const tiles = [];
  const { cols, rows, sourceSize, sourceOffset } = imgSetConfig;

  for (let row = 0, index = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++, index++) {
      if (index < from) continue;
      if (index > to) break;

      tiles.push(
        new Tile({
          imageName,
          x: col * (sourceSize + sourceOffset),
          y: row * (sourceSize + sourceOffset),
          size: sourceSize,
        })
      );
    }
  }

  return tiles;
}

//todo: simplify this and above
function loadWinter(ranges) {
  const imageName = IMAGESETS.WINTER;
  return ranges
    .map(index => {
      if (Array.isArray(index)) {
        const [from, to] = index;

        return loadTiles({ imageName, from, to });
      } else if (Number.isInteger(index)) {
        return loadTiles({
          imageName,
          from: index,
          to: index,
        });
      }
    })
    .flat();
}

const surfaceTileSet = Object.entries(winter).reduce((acc, [key, value]) => {
  acc[key] = loadWinter(value);
  return acc;
}, {});

//console.log("tilesets done", surfaceTileSet);

//todo: make func for that and above
const wallTileSet = Object.entries(winterWalls).reduce((acc, [key, value]) => {
  acc[key] = loadWinter(value);
  return acc;
}, {});

//get unique brush pairs from tileset
export const brushPairs = new Set(
  Object.keys(surfaceTileSet)
    .map(tileCode => [...new Set(tileCode)].sort().join(""))
    .filter(pair => pair.length > 1)
);

export { surfaceTileSet, wallTileSet };
