import { Tile } from "./components/tile.js";
import { editor } from "./config.js";

const { cellSizePx } = editor;

const IMAGESETS = {
  WINTER: "winter.png",
  DESERT: "desert.png",
  SPRING: "spring.png",
  //todo: SHROOMS? find that sprites
};

const imgSetConfig1 = {
  sourceSize: cellSizePx,
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

//todo: simplify this and above
function winter(...ranges) {
  return ranges
    .map(index => {
      if (Array.isArray(index)) {
        const [from, to] = index;

        return loadTiles({ imageName: IMAGESETS.WINTER, from, to });
      } else if (Number.isInteger(index)) {
        return loadTiles({
          imageName: IMAGESETS.WINTER,
          from: index,
          to: index,
        });
      }
    })
    .flat();
}

export const winterTileSetDebug = loadTiles({
  imageName: IMAGESETS.WINTER,
  from: 16,
  to: 378,
});

export const winterTileSet = {
  /**
   * regex:
   * ("\w*)(f)(\w*")
   * $1z$3
   */

  ["ssss"]: winter([349, 351]), //snow
  ["iiii"]: winter([331, 334]), //ice
  //transitions
  ["isss"]: winter([259, 260]),
  ["siss"]: winter([261, 262]),
  ["iiss"]: winter([263, 265]),
  ["ssis"]: winter([266, 267]),
  ["isis"]: winter([268, 270]),
  ["siis"]: winter([271, 272]),
  ["iiis"]: winter([273, 274]),
  ["sssi"]: winter([275, 276]),
  ["issi"]: winter([277, 278]),
  ["sisi"]: winter([279, 281]),
  ["iisi"]: winter([282, 283]),
  ["ssii"]: winter([284, 286]),
  ["isii"]: winter([287, 288]),
  ["siii"]: winter([289, 290]),

  ["wwww"]: winter([319, 321]), //water
  //transitions
  ["wiii"]: winter([199, 200]),
  ["iwii"]: winter([201, 202]),
  ["wwii"]: winter([203, 205]),
  ["iiwi"]: winter([206, 207]),
  ["wiwi"]: winter([208, 210]),
  ["iwwi"]: winter(211, 229), //todo: redraw basic tileset
  ["wwwi"]: winter([212, 213]),
  ["iiiw"]: winter([214, 215]),
  ["wiiw"]: winter(216, 230), //todo: redraw basic tileset
  ["iwiw"]: winter([217, 219]),
  ["wwiw"]: winter([220, 221]),
  ["iiww"]: winter([222, 224]),
  ["wiww"]: winter([225, 226]),
  ["iwww"]: winter([227, 228]),

  ["ffff"]: winter(136), //forest
  //transitions - todo: not sure about those, recheck
  ["fsss"]: winter(110, 133),
  ["sfss"]: winter(102, 127),
  ["ffss"]: winter(124, 134),
  ["ssfs"]: winter(107, 131),
  ["fsfs"]: winter(109, 132),
  ["sffs"]: winter(114), //podstava
  ["fffs"]: winter(111),
  ["sssf"]: winter(104, 129),
  ["fssf"]: winter([112, 113]),
  ["sfsf"]: winter(115, 128),
  ["ffsf"]: winter(112, 113, 120),
  ["ssff"]: winter(106, 130),
  ["fsff"]: winter(125),
  ["sfff"]: winter(105),

  ["rrrr"]: winter(160, [172, 174]), //rocks
  //transitions - todo: not sure about those, recheck
  ["riii"]: winter(145, 168),
  ["irii"]: winter(137, 162),
  ["rrii"]: winter(159, 171),
  ["iiri"]: winter(142, 166),
  ["riri"]: winter(151, 167),
  ["irri"]: winter(170), // /
  ["rrri"]: winter(146, 149),
  ["iiir"]: winter(139, 164),
  ["riir"]: winter(169), // \
  ["irir"]: winter(138, 163),
  ["rrir"]: winter(147, 148),
  ["iirr"]: winter(141, 165),
  ["rirr"]: winter(143),
  ["irrr"]: winter(140),

  ["IIII"]: winter([340, 343]), //dark ice
  //transitions - todo: not sure about those, recheck
  ["Iiii"]: winter([175, 176]), //ok
  ["iIii"]: winter([177, 178]), //ok
  ["IIii"]: winter([179, 180]), //ok
  ["iiIi"]: winter([181, 182]), //ok
  ["IiIi"]: winter([183, 184]), //ok
  ["iIIi"]: winter([185, 186]),
  ["IIIi"]: winter(187), //cant find
  ["iiiI"]: winter([188, 189]), //ok
  ["IiiI"]: winter([190, 191]), //ok
  ["iIiI"]: winter([192, 193]), //ok
  ["IIiI"]: winter(194),
  ["iiII"]: winter([195, 196]),
  ["IiII"]: winter(198),
  ["iIII"]: winter(197),

  ["SSSS"]: winter([364, 366]), //snow dark
  //transitions
  ["Ssss"]: winter([231, 232]),
  ["sSss"]: winter([233, 234]),
  ["SSss"]: winter([235, 236, 237]),
  ["ssSs"]: winter([238, 239]),
  ["SsSs"]: winter([240, 242]),
  ["sSSs"]: winter([243, 244]),
  ["SSSs"]: winter(245),
  ["sssS"]: winter([246, 247]),
  ["SssS"]: winter([248, 249]),
  ["sSsS"]: winter([250, 252]),
  ["SSsS"]: winter(253),
  ["ssSS"]: winter([254, 256]),
  ["SsSS"]: winter(258),
  ["sSSS"]: winter(257),
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
      sourceSize: cellSizePx,
      sourceOffset: 0,
      cols: 19,
      rows: 20,
    },
  }),
};
