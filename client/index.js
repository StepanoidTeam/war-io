import { ctx } from "./context.js";
import { GameMap } from "./components/game-map.js";
import { debug, editor, cellSizePx } from "./config.js";
import { cursor } from "./components/cursor.js";

const canvasCleaner = {
  draw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },
};

(async () => {
  const gameMap = new GameMap({ size: { rows: 20, cols: 20 } });

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
//gui.addColor(debug, "cellColor");
