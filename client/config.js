export const debug = {
  showBrushMarkers: false,
  showCells: false,
  cellColor: [255, 255, 255, 0.2],
  renderTiles: true,
};

const brushes = { ice: "i", snow: "s", water: "w", forest: "f", rocks: "r" };

export const editor = {
  cellSizePx: 32,
  mapSize: 20,
  brushes,
  defaultTileCode: brushes.snow.repeat(4),
  brush: brushes.water,
  brushSize: 1,
  cursorColor: "greenyellow",
};
