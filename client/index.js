import { GameMap } from "./components/map/game-map.js";
import { debug, editor } from "./config.js";
import { cursor } from "./components/cursor.js";
import { MiniMap } from "./components/mini-map.js";
import { CanvasCleaner } from "./components/canvas-cleaner.js";
import { TileMap } from "./components/map/tile-map.js";
import { WallMap } from "./components/map/wall-map.js";
import { wallTileSet } from "./common/tilesets/tilesets.js";

const { cellSizePx, mapSize } = editor;

function getColRowFromMouseEvent(event) {
  const { layerX, layerY } = event;
  const col = Math.floor(layerX / cellSizePx);
  const row = Math.floor(layerY / cellSizePx);

  return [col, row];
}

(async () => {
  const gameMap = new GameMap({ size: { rows: mapSize, cols: mapSize } });

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

    //todo: make better statement
    if (editor.brush === editor.brushes.wall) {
      wallMap.paint(col, row);
    } else {
      gameMap.click(col, row);
    }
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
    paint(col, row);

    cursor.move(col, row);
  });

  mapContainer.addEventListener("click", event => {
    const [col, row] = getColRowFromMouseEvent(event);
    //todo: doesn't work - fix
    paint(col, row);
  });

  const miniMap = new MiniMap({ width: 100, height: 100 });

  document.body.append(miniMap.ctx.canvas);

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
})();

//dat-gui
const gui = new dat.GUI();
gui.add(editor, "brush", editor.brushes);
gui.add(editor, "brushSize", 1, 3).step(1);
gui.add(debug, "showTileGrid");
gui.add(debug, "showCellTypes");
gui.add(debug, "renderTiles");

//gui.addColor(debug, "cellColor");
