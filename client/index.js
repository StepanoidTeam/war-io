import { getImage } from "./helpers/get-image.js";
import { Sprite } from "./components/sprite.js";
import { TileSprite } from "./components/tile-sprite.js";
import { ctx } from "./context.js";

(async () => {
  const cross = await getImage("x_startpoint.png");
  const tilesetSnow = await getImage("29503.png");

  const tileData = { sourceSize: 32, sourceOffset: 1 };

  const sprites = [
    //new Sprite({ x: 0, y: 0, image: tilesetSnow }),
    new Sprite({ x: 0, y: 0, image: cross }),
    new Sprite({ x: 1, y: 1, image: cross }),

    // new TileSprite({
    //   x: 10,
    //   y: 10,
    //   image: tilesetSnow,
    //   sourcePoint: { x: 16, y: 0 },
    //   ...tileData,
    //   debug: "kek",
    // }),
    // new TileSprite({
    //   x: 1,
    //   y: 0,
    //   image: tilesetSnow,
    //   sourcePoint: { x: 18, y: 0 },
    //   ...tileData,
    // }),
  ];

  //greens

  //0.16, 0.18
  //1.0 - 1.18

  //green
  //10,12-03,14

  //tileset
  const cols = 19;
  const rows = 20;
  //winter
  const skipFirst = 16;
  const skipLast = 1;

  for (let row = 0, index = 0; row < rows; row++) {
    //break;
    for (let col = 0; col < cols; col++, index++) {
      if (index < skipFirst) continue;
      if (index >= cols * rows - skipLast) break;
      sprites.push(
        new TileSprite({
          x: col,
          y: row,
          image: tilesetSnow,
          sourcePoint: { x: col, y: row },
          debug: `${index}\n${col}:${row}`,
          ...tileData,
        })
      );
    }
  }

  sprites.forEach(s => s.draw(ctx));

  console.log(sprites[1]);
})();
