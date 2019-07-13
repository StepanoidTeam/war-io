import { GameMap } from "./components/map/game-map.js";
import { debug, editor } from "./config.js";
import { cursor } from "./components/cursor.js";
import { MiniMap } from "./components/mini-map.js";
import { CanvasCleaner } from "./components/canvas-cleaner.js";
import { TileMap } from "./components/map/tile-map.js";
import { WallMap } from "./components/map/wall-map.js";
import { wallTileSet, surfaceTileSet } from "./common/tilesets/tilesets.js";
import { EditorTool } from "./components/editor-tool.js";
import { Status } from "./components/status.js";

const { cellSizePx, mapSize } = editor;

function getColRowFromMouseEvent(event) {
  const { layerX, layerY } = event;
  const col = Math.floor((layerX - cursor.offset) / cellSizePx);
  const row = Math.floor((layerY - cursor.offset) / cellSizePx);

  return [col, row];
}

(async () => {
  const gameMap = new GameMap({
    size: { rows: mapSize, cols: mapSize },
    ininitalBrush: editor.brushes.snow,
  });

  const tileMap = new TileMap({ surfaceTypeCells: gameMap.cells });
  const wallMap = new WallMap(wallTileSet);

  const ctxTileLayer = document.createElement("canvas").getContext("2d");
  const ctxOverlayLayer = document.createElement("canvas").getContext("2d");
  //set canvas size

  const canvasSize = mapSize * cellSizePx;
  //canvas container
  const mapContainer = document.getElementById("map-container");
  mapContainer.style.width = `${canvasSize}px`;
  mapContainer.style.height = `${canvasSize}px`;

  //tile layer
  ctxTileLayer.canvas.height = canvasSize;
  ctxTileLayer.canvas.width = canvasSize;
  //overlay layer - debug info, cursor
  ctxOverlayLayer.canvas.height = canvasSize;
  ctxOverlayLayer.canvas.width = canvasSize;
  //layers - more to go: units, etc...

  mapContainer.append(ctxTileLayer.canvas);
  mapContainer.append(ctxOverlayLayer.canvas);

  function paint(col, row) {
    if (!isDrawing) return;

    editor.currentTool(col, row);
  }

  let isDrawing = false;
  //todo: hanlde events better
  //not sure, should i bind on canvas or mb on whole container?
  mapContainer.addEventListener("mousedown", () => {
    isDrawing = true;
  });

  mapContainer.addEventListener("mouseup", () => {
    isDrawing = false;
  });

  mapContainer.addEventListener("mousemove", event => {
    const [col, row] = getColRowFromMouseEvent(event);
    cursor.move(col, row);

    status.update(col, row);

    paint(col, row);
  });

  mapContainer.addEventListener("click", event => {
    isDrawing = true;
    const [col, row] = getColRowFromMouseEvent(event);
    //todo: doesn't work - fix
    paint(col, row);
    isDrawing = false;
  });

  const miniMap = new MiniMap({
    width: cellSizePx * 4,
    height: cellSizePx * 4,
  });

  const status = new Status(document.querySelector(".status-bar"));

  const miniMapContainer = document.getElementById("mini-map-container");
  miniMapContainer.append(miniMap.ctx.canvas);

  const drawables = [
    [new CanvasCleaner(), ctxTileLayer],
    [new CanvasCleaner(), ctxOverlayLayer],
    [tileMap, ctxTileLayer],
    //todo: make separate layer for walls?
    [wallMap, ctxTileLayer],
    [gameMap, ctxOverlayLayer],
    [miniMap, ctxTileLayer],
    [cursor, ctxOverlayLayer],
  ];

  requestAnimationFrame(function render() {
    drawables.forEach(([component, context]) => component.draw(context));
    requestAnimationFrame(render);
  });

  //editor tools
  const toolBox = document.querySelector(".tool-box");

  //debugTile, crossTile,

  // init surface tools
  // explicit declaration to keep proper order (not obj.entries)
  const surfaceBrushes = [
    "forest",
    "rocks",
    "snow",
    "snowDark",
    "ice",
    "iceDark",
    "water",
    "waterDark",
  ]
    .map(type => [type, editor.brushes[type]])

    .map(([type, brush]) =>
      EditorTool({
        tile: surfaceTileSet[brush.repeat(4)][0],
        groupName: "surface",
        value: type,
        callback: () => {
          cursor.offset = 0;
          editor.currentTool = (col, row) =>
            gameMap.paint({
              col,
              row,
              brush,
              brushSize: editor.brushSize,
            });
        },
      })
    )
    .forEach(elem => toolBox.append(elem));

  // wall tool
  const wallTool = EditorTool({
    tile: wallTileSet["0000"][0],
    groupName: "surface",
    value: "wall",
    callback: () => {
      cursor.offset = cellSizePx / 2;
      editor.currentTool = (col, row) => {
        wallMap.paint(col, row);
        gameMap.paint({
          col,
          row,
          brush: editor.brushes.snow,
          brushSize: 2,
        });
      };
    },
  });

  toolBox.append(wallTool);
})();

//dat-gui
const gui = new dat.GUI();
gui.add(editor, "brush", editor.brushes);
gui.add(editor, "brushSize", 1, 3).step(1);
gui.add(debug, "showTileGrid");
gui.add(debug, "showCellTypes");
gui.add(debug, "renderTiles");
