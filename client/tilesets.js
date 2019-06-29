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
  return () => getRandomItem(win(from, to));
}

function win(from, to) {
  return loadTiles({ imageName: IMAGESETS.WINTER, from, to });
}

export const winterTileSet = {
  all: loadTiles({ imageName: IMAGESETS.WINTER, from: 16, to: 378 }),

  snowIce: {
    ["ssss"]: winter(349, 351), //snow
    ["iiii"]: winter(331, 334), //ice
    //transitions
    ["isss"]: winter(259, 260),
    ["siss"]: winter(261, 262),
    ["iiss"]: winter(263, 265),
    ["ssis"]: winter(266, 267),
    ["isis"]: winter(268, 270),
    ["siis"]: winter(271, 272),
    ["iiis"]: winter(273, 274),
    ["sssi"]: winter(275, 276),
    ["issi"]: winter(277, 278),
    ["sisi"]: winter(279, 281),
    ["iisi"]: winter(282, 283),
    ["ssii"]: winter(284, 286),
    ["isii"]: winter(287, 288),
    ["siii"]: winter(289, 290),

    ["wwww"]: winter(319, 321), //water
    //transitions
    ["wiii"]: winter(199, 200),
    ["iwii"]: winter(201, 202),
    ["wwii"]: winter(203, 205),
    ["iiwi"]: winter(206, 207),
    ["wiwi"]: winter(208, 210),
    ["iwwi"]: () => getRandomItem([...win(211, 211), ...win(229, 229)]), //podstava
    ["wwwi"]: winter(212, 213),
    ["iiiw"]: () => getRandomItem([...win(214, 215)]),
    ["wiiw"]: () => getRandomItem([...win(216, 216), ...win(230, 230)]),
    ["iwiw"]: winter(217, 219),
    ["wwiw"]: winter(220, 221),
    ["iiww"]: winter(222, 224),
    ["wiww"]: winter(225, 226),
    ["iwww"]: winter(227, 228),
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
