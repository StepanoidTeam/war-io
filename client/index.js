import { ctx } from "./context.js";
import { GameMap } from "./components/game-map.js";
import { debug, editor } from "./config.js";
import { cursor } from "./components/cursor.js";

const { cellSizePx, mapSize } = editor;

const canvasCleaner = {
  draw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },
};

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
    const { layerX, layerY } = event;

    const col = Math.floor(layerX / cellSizePx);
    const row = Math.floor(layerY / cellSizePx);

    if (isDrawing) gameMap.click(col, row);

    cursor.move(col, row);
  });

  ctx.canvas.addEventListener("click", event => {
    const { layerX, layerY } = event;

    const col = Math.floor(layerX / cellSizePx);
    const row = Math.floor(layerY / cellSizePx);

    gameMap.click(col, row);
  });

  const drawables = [canvasCleaner, gameMap, cursor];

  requestAnimationFrame(function render() {
    drawables.forEach(s => s.draw(ctx));
    requestAnimationFrame(render);
  });
})();

//dat-gui
const gui = new dat.GUI();
gui.add(editor, "brush", editor.brushes);
gui.add(editor, "brushSize", 1, 3).step(1);
gui.add(debug, "showBrushMarkers");
gui.add(debug, "showCells");
gui.add(debug, "renderTiles");
//gui.addColor(debug, "cellColor");
