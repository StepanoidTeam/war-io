export const cellSizePx = 32;

export const debug = {
  showBrushMarkers: false,
  showCells: false,
  cellColor: [255, 255, 255, 0.2],
};

const brushes = { ice: "i", snow: "s", water: "w", forest: "f", rocks: "r" };

export const editor = {
  cellSizePx,
  brushes,
  defaultTileCode: brushes.snow.repeat(4),
  brush: brushes.water,
  brushSize: 1,
  cursorColor: "greenyellow",
};
