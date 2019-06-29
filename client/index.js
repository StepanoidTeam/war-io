import { ctx } from "./context.js";
import { GameMap } from "./components/game-map.js";
import { debug, brushes } from "./config.js";

const canvasCleaner = {
  draw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },
};

(async () => {
  const drawables = [
    canvasCleaner,
    new GameMap({ size: { rows: 20, cols: 20 } }),
  ];

  requestAnimationFrame(function render() {
    drawables.forEach(s => s.draw(ctx));
    requestAnimationFrame(render);
  });
})();

//dat-gui
const gui = new dat.GUI();
gui.add(debug, "brush", brushes);
gui.add(debug, "enabled");
gui.addColor(debug, "cellColor");
