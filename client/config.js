export const debug = {
  showCellTypes: false,
  renderTiles: true,
  showCollides: false,
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
  ice: "#80b4e1",
  snow: "#e3e3e3",
  water: "#327cc7",
  forest: "#2ceba5",
  rocks: "#ffa07f",
  iceDark: "#5f98ca",
  snowDark: "#c3c3c3",
  waterDark: "#2065ab",
};

export const IMAGES = {
  DEBUG: "debug",
  CURSOR: "cursor",
  CELL: "cell",
  BRUSH_MARKERS: "brush_markers",
  OBSTACLE: "obstacle",
  PASSABLE: "passable",
  BUILDABLE: "buildable",
};

export const IMAGESETS = {
  WINTER: "winter.png",
  DESERT: "desert.png",
  SPRING: "spring.png",
  //todo: SHROOMS? find that tileset
};

export const editor = {
  cellSizePx: 32,
  mapSize: 20,
  brushes,
  defaultTileCode: brushes.snow.repeat(4),
  brush: brushes.ice,
  currentTool: () => {},
  brushSize: 1,
  cursorColor: "#ffffff",
};
