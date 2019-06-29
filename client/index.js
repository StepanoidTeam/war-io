import { ctx } from "./context.js";

import { GameMap } from "./components/game-map.js";
import { Tile } from "./components/tile.js";
import { debug } from "./config.js";

(async () => {
  const drawables = [new GameMap({ size: { rows: 20, cols: 20 } })];

  requestAnimationFrame(function render() {
    drawables.forEach(s => s.draw(ctx));
    requestAnimationFrame(render);
  });
})();

//10147 - ranee
//10132 - 2300

//controls init

const gui = new dat.GUI();

gui.add(debug, "enabled");

gui.addColor(debug, "cellColor");
