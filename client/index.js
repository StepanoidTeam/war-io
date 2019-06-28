import { Sprite } from "./components/sprite.js";
import { ctx } from "./context.js";
import {
  winterTileSet,
  desertTileSet,
  springTileSet,
  testTileSet,
} from "./tilesets.js";

(async () => {
  const cross = "x_startpoint.png";

  const sprites = [
    new Sprite({ x: 0, y: 0, imageName: cross }),
    new Sprite({ x: 1, y: 1, imageName: cross }),

    ...winterTileSet.all,
    //...desertTileSet.all,
    //...springTileSet.all,
    //...testTileSet.all,
  ];

  requestAnimationFrame(function render() {
    sprites.forEach(s => s.draw(ctx));
    requestAnimationFrame(render);
  });

  console.log(sprites[1]);
})();
