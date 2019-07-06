import { Tile } from "../components/tile.js";
import { editor, IMAGESETS } from "../config.js";

const { cellSizePx } = editor;

const defaultImgSetConfig = {
  sourceSize: cellSizePx,
  sourceOffset: 1,
  cols: 19,
  rows: 20,
};

function loadTiles({
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
function winter(...ranges) {
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

export const winterTileSet = {
  /**
   * regex:
   * ("\w*)(f)(\w*")
   * $1z$3
   */

  ["ffff"]: winter([135, 136], 125), //forest
  ["ssss"]: winter([349, 351]), //snow
  ["iiii"]: winter([331, 333]), //ice
  ["wwww"]: winter([319, 321]), //water

  ["0000"]: winter([0, 7]), //null

  ["rrrr"]: winter(/*160*/ [172, 174]), //rocks
  ["SSSS"]: winter([364, 366]), //snow dark - seems ok
  ["IIII"]: winter([340, 342]), //dark ice
  ["WWWW"]: winter([325, 327]), //water dark -- seems everything is ok

  ["0001"]: winter([0, 7]), //null

  //transitions - todo: not sure about those, recheck
  ["fsss"]: winter(110, 133),
  ["sfss"]: winter(102, 127),
  ["ffss"]: winter(124, 134),
  ["ssfs"]: winter(107, 131),
  ["fsfs"]: winter(109, 132),
  ["sffs"]: winter(114),
  ["fffs"]: winter(111),
  ["sssf"]: winter(104, 129),
  ["fssf"]: winter([112, 113]),
  ["sfsf"]: winter(115, 128),
  ["ffsf"]: winter(112, 113, 120),
  ["ssff"]: winter(106, 130),
  ["fsff"]: winter(108),
  ["sfff"]: winter(105),

  ["0002"]: winter([0, 10], [0, 3]), //null

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

  ["0003"]: winter([0, 7]), //null

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

  ["0004"]: winter([0, 7]), //null

  //transitions - todo: not sure about those, recheck
  ["riii"]: winter(145, 168), //2
  ["irii"]: winter(137, 162), //2
  ["rrii"]: winter(159, 171), //⚠️ missing tile
  ["iiri"]: winter(142, 166), //2
  ["riri"]: winter(151, 167), //⚠️ missing tile
  ["irri"]: winter(170), //⚠️ missing tile
  ["rrri"]: winter(146, 149), // additional???
  ["iiir"]: winter(139, 164), //2
  ["riir"]: winter(169), //1
  ["irir"]: winter(138, 163), //⚠️ missing tile
  ["rrir"]: winter(147, 148), //additional???
  ["iirr"]: winter(141, 165), //⚠️ missing tile
  ["rirr"]: winter(143), //1
  ["irrr"]: winter(140), //1

  ["0005"]: winter([0, 7], [0, 7]), //null

  //transitions - todo: not sure about those, recheck
  ["Iiii"]: winter([175, 176]), //2
  ["iIii"]: winter([177, 178]), //2
  ["IIii"]: winter([179, 180]), //⚠️ missing tile
  ["iiIi"]: winter([181, 182]), //2
  ["IiIi"]: winter([183, 184]), //⚠️ missing tile
  ["iIIi"]: winter([185, 186]), //2
  ["IIIi"]: winter(187), //1
  ["iiiI"]: winter([188, 189]), //2
  ["IiiI"]: winter([190, 191]), //2
  ["iIiI"]: winter([192, 193]), //⚠️ missing tile
  ["IIiI"]: winter(194), //1
  ["iiII"]: winter([195, 196]), //⚠️ missing tile
  ["IiII"]: winter(198), //1
  ["iIII"]: winter(197), //1

  ["0006"]: winter([0, 7], [0, 7]), //null

  //transitions
  ["Wwww"]: winter([291, 292]), //2
  ["wWww"]: winter([293, 294]), //2
  ["WWww"]: winter([295, 297]), //3
  ["wwWw"]: winter([298, 299]), //2
  ["WwWw"]: winter([300, 302]), //3
  ["wWWw"]: winter([303, 304]), //2
  ["WWWw"]: winter(305), //1
  ["wwwW"]: winter([306, 307]), //2
  ["WwwW"]: winter([308, 309]), //2
  ["wWwW"]: winter([310, 312]), //3
  ["WWwW"]: winter(313), //1
  ["wwWW"]: winter([314, 316]), //3
  ["WwWW"]: winter(317), //1
  ["wWWW"]: winter(318), //1

  ["0007"]: winter([0, 11]), //null
  //transitions
  ["Ssss"]: winter([231, 232]),
  ["sSss"]: winter([233, 234]),
  ["SSss"]: winter([235, 237]),
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

console.log("tilesets done");

//get unique brush pairs from tileset
export const brushPairs = new Set(
  Object.keys(winterTileSet)
    .map(tileCode => [...new Set(tileCode)].sort().join(""))
    .filter(pair => pair.length > 1)
);
