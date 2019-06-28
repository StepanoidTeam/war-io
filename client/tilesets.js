import { TileSprite } from "./components/tile-sprite.js";

const IMAGESETS = {
  WINTER: "winter.png",
  DESERT: "desert.png",
  SPRING: "spring.png",
  //todo: SHROOMS? find that sprite
};

function loadBunch({
  imageName,
  from,
  to,
  imgSetConfig = {
    sourceSize: 32,
    sourceOffset: 1,
    cols: 19,
    rows: 20,
  },
}) {
  const sprites = [];
  const { cols, rows, sourceSize, sourceOffset } = imgSetConfig;

  for (let row = 0, index = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++, index++) {
      if (index < from) continue;
      if (index > to) break;
      sprites.push(
        new TileSprite({
          imageName,
          x: col,
          y: row,
          sourcePoint: { x: col, y: row },
          debug: `${index}\n${col}:${row}`,
          debug: `${index}`,
          ...imgSetConfig,
        })
      );
    }
  }

  return sprites;
}

export const winterTileSet = {
  all: loadBunch({ imageName: IMAGESETS.WINTER, from: 16, to: 378 }),
  wallHuman: loadBunch({ imageName: IMAGESETS.WINTER, from: 16, to: 33 }),
  wallHumanDamaged: loadBunch({
    imageName: IMAGESETS.WINTER,
    from: 52,
    to: 69,
  }),
  wallOrc: loadBunch({ imageName: IMAGESETS.WINTER, from: 34, to: 51 }),
  trees: loadBunch({ imageName: IMAGESETS.WINTER, from: 102, to: 136 }),
  ice: loadBunch({ imageName: IMAGESETS.WINTER, from: 175, to: 198 }),
  iceSpecial: loadBunch({ imageName: IMAGESETS.WINTER, from: 331, to: 348 }),
  snow: loadBunch({ imageName: IMAGESETS.WINTER, from: 231, to: 258 }),
  water: loadBunch({ imageName: IMAGESETS.WINTER, from: 291, to: 330 }),
};

export const springTileSet = {
  all: loadBunch({ imageName: IMAGESETS.SPRING, from: 16, to: 371 }),
};

export const desertTileSet = {
  all: loadBunch({ imageName: IMAGESETS.DESERT, from: 16, to: 372 }),
};

export const testTileSet = {
  all: loadBunch({
    imageName: "test.jpg",
    from: 95,
    to: 300,
    imgSetConfig: {
      sourceSize: 32,
      sourceOffset: 0,
      cols: 19,
      rows: 20,
    },
  }),
};
