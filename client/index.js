import { getImage } from "./helpers/get-image.js";
import { Sprite } from "./components/sprite.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

(async () => {
  ctx.canvas.height = 500;
  ctx.canvas.width = 500;

  const cross = await getImage("x_startpoint.png");
  const tilesetSnow = await getImage("29501.png");

  const sprites = [
    new Sprite({ x: 0, y: 0, image: tilesetSnow }),
    new Sprite({ x: 0, y: 0, image: cross }),
    new Sprite({ x: 1, y: 1, image: cross }),
  ];

  sprites.forEach(s => s.draw(ctx));

  console.log(sprites[1]);
})();
