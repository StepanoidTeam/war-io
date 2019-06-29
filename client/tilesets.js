import { Tile } from "./components/tile.js";
import { getRandomItem } from "./helpers/random.js";

const IMAGESETS = {
  WINTER: "winter.png",
  DESERT: "desert.png",
  SPRING: "spring.png",
  //todo: SHROOMS? find that sprites
};

const imgSetConfig1 = {
  sourceSize: 32,
  sourceOffset: 1,
  cols: 19,
  rows: 20,
};

function loadTiles({ imageName, from, to, imgSetConfig = imgSetConfig1 }) {
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

function winter(from, to) {
  return () =>
    getRandomItem(loadTiles({ imageName: IMAGESETS.WINTER, from, to }));
}

export const winterTileSet = {
  all: loadTiles({ imageName: IMAGESETS.WINTER, from: 16, to: 378 }),

  snowIce: {
    [0b1111]: winter(349, 351), //snow
    [0b0000]: winter(331, 334), //ice
    //transitions
    [0b0111]: winter(259, 260),
    [0b1011]: winter(261, 262),
    [0b0011]: winter(263, 265),
    [0b1101]: winter(266, 267),
    [0b0101]: winter(268, 270),
    [0b1001]: winter(271, 272),
    [0b0001]: winter(273, 274),
    [0b1110]: winter(275, 276),
    [0b0110]: winter(277, 278),
    [0b1010]: winter(279, 281),
    [0b0010]: winter(282, 283),
    [0b1100]: winter(284, 286),
    [0b0100]: winter(287, 288),
    [0b1000]: winter(289, 290),
  },

  wall: loadTiles({ imageName: IMAGESETS.WINTER, from: 33, to: 33 }),
  wallHuman: loadTiles({ imageName: IMAGESETS.WINTER, from: 16, to: 33 }),
  wallHumanDamaged: loadTiles({
    imageName: IMAGESETS.WINTER,
    from: 52,
    to: 69,
  }),
  wallOrc: loadTiles({ imageName: IMAGESETS.WINTER, from: 34, to: 51 }),
  trees: [
    ...loadTiles({ imageName: IMAGESETS.WINTER, from: 108, to: 108 }),
    // ...loadTiles({ imageName: IMAGESETS.WINTER, from: 111, to: 120 }),
  ],
  ice: loadTiles({ imageName: IMAGESETS.WINTER, from: 175, to: 198 }),
  iceSpecial: loadTiles({ imageName: IMAGESETS.WINTER, from: 331, to: 348 }),
  snowDay: [
    ...loadTiles({ imageName: IMAGESETS.WINTER, from: 349, to: 351 }),
    //...loadTiles({ imageName: IMAGESETS.WINTER, from: 352, to: 363 }),
  ],
  snowNight: [
    ...loadTiles({ imageName: IMAGESETS.WINTER, from: 364, to: 378 }),
  ],
  water: loadTiles({ imageName: IMAGESETS.WINTER, from: 291, to: 330 }),
};

export const springTileSet = {
  all: loadTiles({ imageName: IMAGESETS.SPRING, from: 16, to: 371 }),
};

export const desertTileSet = {
  all: loadTiles({ imageName: IMAGESETS.DESERT, from: 16, to: 372 }),
};

export const testTileSet = {
  all: loadTiles({
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

export const crossTile = new Tile({
  x: 0,
  y: 0,
  size: 32,
  imageName: "x_startpoint.png",
});
