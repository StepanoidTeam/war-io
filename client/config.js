export const debug = {
  showTileGrid: false,
  showCellTypes: false,
  cellColor: [255, 255, 255, 0.2],
  renderTiles: true,
};

const brushes = {
  ice: "i",
  snow: "s",
  water: "w",
  forest: "f",
  rocks: "r",
  //darkness
  iceDark: "I",
  snowDark: "S",
  waterDark: "W",
};

//concat with brushes
export const brushColors = {
  ice: "#97cfff",
  snow: "#ffffff",
  water: "#5995da",
  forest: "#87f9cf",
  rocks: "#ffb399",
  iceDark: "lightgray", //todo: set better colors
  snowDark: "gray",
  waterDark: "blue",
};

export const IMAGES = {
  DEBUG: "debug",
  CURSOR: "cursor",
  CELL: "cell",
  BRUSH_MARKERS: "brush_markers",
};

export const IMAGESETS = {
  WINTER: "winter.png",
  DESERT: "desert.png",
  SPRING: "spring.png",
  //todo: SHROOMS? find that sprites
};

export const editor = {
  cellSizePx: 32,
  mapSize: 20,
  brushes,
  defaultTileCode: brushes.snow.repeat(4),
  brush: brushes.water,
  brushSize: 1,
  cursorColor: "greenyellow",
};
