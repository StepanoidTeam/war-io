import { TileSprite } from "./components/tile-sprite.js";

const IMAGESETS = {
  WINTER: "winter.png",
  DESERT: "desert.png",
  SPRING: "spring.png",
  //todo: SHROOMS? find that sprite
};

function loadBunch({ imageName, from, to }) {
  //tileset size
  const cols = 19;
  const rows = 20;
  const imgSetConfig = { sourceSize: 32, sourceOffset: 1 };

  const sprites = [];

  for (let row = 0, index = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++, index++) {
      if (index < from) continue;
      if (index > to) break;
      sprites.push(
        new TileSprite({
          imageName,
          x: col,
          y: row,
          sourcePoint: { x: col, y: row },
          debug: `${index}\n${col}:${row}`,
          ...imgSetConfig,
        })
      );
    }
  }

  return sprites;
}

export const winterTileSet = {
  all: loadBunch({ imageName: IMAGESETS.WINTER, from: 16, to: 378 }),
  // wallHuman: loadBunch({ imageName: IMAGESETS.WINTER, from: 16, to: 33 }),
};
