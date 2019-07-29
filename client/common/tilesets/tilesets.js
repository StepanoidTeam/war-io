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

export function loadTileSet({ imageName, ranges, imgSetConfig }) {
  return ranges
    .map(index => {
      if (Array.isArray(index)) {
        const [from, to] = index;

        return loadTiles({
          imageName,
          from,
          to,
          imgSetConfig,
        });
      } else if (Number.isInteger(index)) {
        return loadTiles({
          imageName,
          from: index,
          to: index,
          imgSetConfig,
        });
      }
    })
    .flat();
}

//todo: simplify this and above
function loadWinter(ranges) {
  return loadTileSet({
    imageName: IMAGESETS.WINTER,
    ranges,
    imgSetConfig: defaultImgSetConfig,
  });
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

// FARM

const building2x2ImgSetConfig = {
  sourceSize: cellSizePx * 2,
  sourceOffset: 0,
  cols: 1,
  rows: 2,
};

// FARM

const winterFarm = {
  ["human-farm-done"]: [0],
  ["human-farm-building"]: [1],
};

const farmTileSet = Object.entries(winterFarm).reduce((acc, [key, ranges]) => {
  acc[key] = loadTileSet({
    imageName: "structures/farm.png",
    ranges,
    imgSetConfig: building2x2ImgSetConfig,
  });

  return acc;
}, {});

// GOLD MINE

const goldMine = {
  ["winter-gold-mine"]: [1],
  ["winter-gold-mine-active"]: [4],
};

const goldMineTileSet = Object.entries(goldMine).reduce(
  (acc, [key, ranges]) => {
    acc[key] = loadTileSet({
      imageName: "structures/gold-mine.png",
      ranges,
      imgSetConfig: {
        sourceSize: cellSizePx * 3,
        sourceOffset: 0,
        cols: 3,
        rows: 2,
      },
    });

    return acc;
  },
  {}
);

//get unique brush pairs from tileset
export const brushPairs = new Set(
  Object.keys(surfaceTileSet)
    .map(tileCode => [...new Set(tileCode)].sort().join(""))
    .filter(pair => pair.length > 1)
);

export { surfaceTileSet, wallTileSet, farmTileSet, goldMineTileSet };
