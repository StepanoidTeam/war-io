//todo: add proper name type
export const winter = {
  /**
   * regex:
   * ("\w*)(f)(\w*")
   * $1z$3
   */

  ["ffff"]: [[135, 136], 125], //forest
  ["ssss"]: [[349, 351]], //snow
  ["iiii"]: [[331, 333]], //ice
  ["wwww"]: [[319, 321]], //water

  //  ["0000"]: ([0, 7]), //null

  ["rrrr"]: [[172, 174]], //rocks /*160*/
  ["SSSS"]: [[364, 366]], //snow dark - seems ok
  ["IIII"]: [[340, 342]], //dark ice
  ["WWWW"]: [[325, 327]], //water dark -- seems everything is ok

  // ["0001"]: ([0, 7]), //null

  //transitions - todo: not sure about those, recheck
  ["fsss"]: [110, 133],
  ["sfss"]: [102, 127],
  ["ffss"]: [124, 134],
  ["ssfs"]: [107, 131],
  ["fsfs"]: [109, 132],
  ["sffs"]: [114],
  ["fffs"]: [111],
  ["sssf"]: [104, 129],
  ["fssf"]: [112, 113],
  ["sfsf"]: [115, 128],
  ["ffsf"]: [112, 113, 120],
  ["ssff"]: [106, 130],
  ["fsff"]: [108],
  ["sfff"]: [105],

  // ["0002"]: ([0, 10], [0, 3]), //null

  //transitions
  ["isss"]: [259, 260],
  ["siss"]: [261, 262],
  ["iiss"]: [[263, 265]],
  ["ssis"]: [266, 267],
  ["isis"]: [[268, 270]],
  ["siis"]: [271, 272],
  ["iiis"]: [273, 274],
  ["sssi"]: [275, 276],
  ["issi"]: [277, 278],
  ["sisi"]: [[279, 281]],
  ["iisi"]: [282, 283],
  ["ssii"]: [[284, 286]],
  ["isii"]: [287, 288],
  ["siii"]: [289, 290],

  // ["0003"]: ([0, 7]), //null

  //transitions
  ["wiii"]: [199, 200],
  ["iwii"]: [201, 202],
  ["wwii"]: [[203, 205]],
  ["iiwi"]: [206, 207],
  ["wiwi"]: [[208, 210]],
  ["iwwi"]: [211, 229], //todo: redraw basic tileset
  ["wwwi"]: [212, 213],
  ["iiiw"]: [214, 215],
  ["wiiw"]: [216, 230], //todo: redraw basic tileset
  ["iwiw"]: [[217, 219]],
  ["wwiw"]: [220, 221],
  ["iiww"]: [[222, 224]],
  ["wiww"]: [225, 226],
  ["iwww"]: [227, 228],

  //["0004"]: ([0, 7]), //null

  //transitions - todo: not sure about those, recheck
  ["riii"]: [145, 168], //2
  ["irii"]: [137, 162], //2
  ["rrii"]: [159, 171], //⚠️ missing tile
  ["iiri"]: [142, 166], //2
  ["riri"]: [151, 167], //⚠️ missing tile
  ["irri"]: [170], //⚠️ missing tile
  ["rrri"]: [146, 149], // additional???
  ["iiir"]: [139, 164], //2
  ["riir"]: [169], //1
  ["irir"]: [138, 163], //⚠️ missing tile
  ["rrir"]: [147, 148], //additional???
  ["iirr"]: [141, 165], //⚠️ missing tile
  ["rirr"]: [143], //1
  ["irrr"]: [140], //1

  // ["0005"]: ([0, 7], [0, 7]), //null

  //transitions - todo: not sure about those, recheck
  ["Iiii"]: [[175, 176]], //2
  ["iIii"]: [[177, 178]], //2
  ["IIii"]: [[179, 180]], //⚠️ missing tile
  ["iiIi"]: [[181, 182]], //2
  ["IiIi"]: [[183, 184]], //⚠️ missing tile
  ["iIIi"]: [[185, 186]], //2
  ["IIIi"]: [187], //1
  ["iiiI"]: [[188, 189]], //2
  ["IiiI"]: [[190, 191]], //2
  ["iIiI"]: [[192, 193]], //⚠️ missing tile
  ["IIiI"]: [194], //1
  ["iiII"]: [[195, 196]], //⚠️ missing tile
  ["IiII"]: [198], //1
  ["iIII"]: [197], //1

  //["0006"]: ([0, 7], [0, 7]), //null

  //transitions
  ["Wwww"]: [[291, 292]], //2
  ["wWww"]: [[293, 294]], //2
  ["WWww"]: [[295, 297]], //3
  ["wwWw"]: [[298, 299]], //2
  ["WwWw"]: [[300, 302]], //3
  ["wWWw"]: [[303, 304]], //2
  ["WWWw"]: [305], //1
  ["wwwW"]: [[306, 307]], //2
  ["WwwW"]: [[308, 309]], //2
  ["wWwW"]: [[310, 312]], //3
  ["WWwW"]: [313], //1
  ["wwWW"]: [[314, 316]], //3
  ["WwWW"]: [317], //1
  ["wWWW"]: [318], //1

  //["0007"]: ([0, 11]), //null
  //transitions
  ["Ssss"]: [[231, 232]],
  ["sSss"]: [[233, 234]],
  ["SSss"]: [[235, 237]],
  ["ssSs"]: [[238, 239]],
  ["SsSs"]: [[240, 242]],
  ["sSSs"]: [[243, 244]],
  ["SSSs"]: [245],
  ["sssS"]: [[246, 247]],
  ["SssS"]: [[248, 249]],
  ["sSsS"]: [[250, 252]],
  ["SSsS"]: [253],
  ["ssSS"]: [[254, 256]],
  ["SsSS"]: [258],
  ["sSSS"]: [257],
};

export const winterWalls = {
  //human
  ["human-0000"]: [16],
  ["human-00x0"]: [17],
  ["human-0x00"]: [18],
  ["human-0xx0"]: [19],
  ["human-x000"]: [20],
  ["human-x0x0"]: [[21, 22]],
  ["human-xx00"]: [23],
  ["human-xxx0"]: [24],
  ["human-000x"]: [25],
  ["human-00xx"]: [26],
  ["human-0x0x"]: [[27, 28]],
  ["human-0xxx"]: [29],
  ["human-x00x"]: [30],
  ["human-x0xx"]: [31],
  ["human-xx0x"]: [32],
  ["human-xxxx"]: [33],
  //human damaged
  ["human-damaged-0000"]: [52],
  ["human-damaged-00x0"]: [53],
  ["human-damaged-0x00"]: [54],
  ["human-damaged-0xx0"]: [55],
  ["human-damaged-x000"]: [56],
  ["human-damaged-x0x0"]: [[57, 58]],
  ["human-damaged-xx00"]: [59],
  ["human-damaged-xxx0"]: [60],
  ["human-damaged-000x"]: [61],
  ["human-damaged-00xx"]: [62],
  ["human-damaged-0x0x"]: [[63, 64]],
  ["human-damaged-0xxx"]: [65],
  ["human-damaged-x00x"]: [66],
  ["human-damaged-x0xx"]: [67],
  ["human-damaged-xx0x"]: [68],
  ["human-damaged-xxxx"]: [69],
  //orc
  ["orc-0000"]: [34],
  ["orc-00x0"]: [35],
  ["orc-0x00"]: [36],
  ["orc-0xx0"]: [37],
  ["orc-x000"]: [38],
  ["orc-x0x0"]: [[39, 40]],
  ["orc-xx00"]: [41],
  ["orc-xxx0"]: [42],
  ["orc-000x"]: [43],
  ["orc-00xx"]: [44],
  ["orc-0x0x"]: [[45, 46]],
  ["orc-0xxx"]: [47],
  ["orc-x00x"]: [48],
  ["orc-x0xx"]: [49],
  ["orc-xx0x"]: [50],
  ["orc-xxxx"]: [51],
  //orc damaged
  ["orc-damaged-0000"]: [70],
  ["orc-damaged-00x0"]: [71],
  ["orc-damaged-0x00"]: [72],
  ["orc-damaged-0xx0"]: [73],
  ["orc-damaged-x000"]: [74],
  ["orc-damaged-x0x0"]: [[75, 76]],
  ["orc-damaged-xx00"]: [77],
  ["orc-damaged-xxx0"]: [78],
  ["orc-damaged-000x"]: [79],
  ["orc-damaged-00xx"]: [80],
  ["orc-damaged-0x0x"]: [[81, 82]],
  ["orc-damaged-0xxx"]: [83],
  ["orc-damaged-x00x"]: [84],
  ["orc-damaged-x0xx"]: [85],
  ["orc-damaged-xx0x"]: [86],
  ["orc-damaged-xxxx"]: [87],
  //destroyed
  ["human-destroyed-0000"]: [88],
  ["human-destroyed-00x0"]: [89],
  ["human-destroyed-0x00"]: [90],
  ["human-destroyed-0xx0"]: [91],
  ["human-destroyed-x000"]: [92],
  ["human-destroyed-x0x0"]: [99], //!
  ["human-destroyed-xx00"]: [94],
  ["human-destroyed-xxx0"]: [94], //!
  ["human-destroyed-000x"]: [95], //!
  ["human-destroyed-00xx"]: [96], //!
  ["human-destroyed-0x0x"]: [97], //!
  ["human-destroyed-0xxx"]: [100], //!?
  ["human-destroyed-x00x"]: [98], //!
  ["human-destroyed-x0xx"]: [101],
  ["human-destroyed-xx0x"]: [101],
  ["human-destroyed-xxxx"]: [101], //!?
  //same
  ["orc-destroyed-0000"]: [88],
  ["orc-destroyed-00x0"]: [89],
  ["orc-destroyed-0x00"]: [90],
  ["orc-destroyed-0xx0"]: [91],
  ["orc-destroyed-x000"]: [92],
  ["orc-destroyed-x0x0"]: [99], //!
  ["orc-destroyed-xx00"]: [94],
  ["orc-destroyed-xxx0"]: [94], //!
  ["orc-destroyed-000x"]: [95], //!
  ["orc-destroyed-00xx"]: [96], //!
  ["orc-destroyed-0x0x"]: [97], //!
  ["orc-destroyed-0xxx"]: [100], //!?
  ["orc-destroyed-x00x"]: [98], //!
  ["orc-destroyed-x0xx"]: [101],
  ["orc-destroyed-xx0x"]: [101],
  ["orc-destroyed-xxxx"]: [101], //!?
};
