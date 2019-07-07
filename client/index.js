import { ctx } from "./context.js";
import { GameMap } from "./components/game-map.js";
import { debug, editor } from "./config.js";
import { cursor } from "./components/cursor.js";
import { MiniMap } from "./components/mini-map.js";
import { CanvasCleaner } from "./components/canvas-cleaner.js";

const { cellSizePx, mapSize } = editor;

function getColRowFromMouseEvent(event) {
  const { layerX, layerY } = event;
  const col = Math.floor(layerX / cellSizePx);
  const row = Math.floor(layerY / cellSizePx);

  return [col, row];
}

(async () => {
  const gameMap = new GameMap({ size: { rows: mapSize, cols: mapSize } });

  let isDrawing = false;
  //todo: hanlde events better
  ctx.canvas.addEventListener("mousedown", () => {
    isDrawing = true;
  });

  ctx.canvas.addEventListener("mouseup", () => {
    isDrawing = false;
  });

  ctx.canvas.addEventListener("mousemove", event => {
    const [col, row] = getColRowFromMouseEvent(event);

    if (isDrawing) gameMap.click(col, row);

    cursor.move(col, row);
  });

  ctx.canvas.addEventListener("click", event => {
    const [col, row] = getColRowFromMouseEvent(event);

    gameMap.click(col, row);
  });

  const miniMap = new MiniMap({ width: 100, height: 100 });

  document.body.append(miniMap.ctx.canvas);

  const drawables = [new CanvasCleaner(), gameMap, miniMap, cursor];

  requestAnimationFrame(function render() {
    drawables.forEach(s => s.draw(ctx));
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
