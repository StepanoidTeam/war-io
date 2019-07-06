import { getImage } from "../helpers/get-image.js";
import { editor, IMAGES } from "../config.js";
import { imageLib } from "../common/image-lib.js";

const { cellSizePx } = editor;
/**
 * image, or image part (with size) to draw on canvas
 */
export class Tile {
  constructor({ x = 0, y = 0, size, imageName }) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.setImage(imageName);
  }

  async setImage(imageName) {
    if (!imageLib.has(imageName)) {
      imageLib.set(imageName, await getImage(imageName));
    }
    this.img = imageLib.get(imageName);
  }

  [Symbol.iterator] = function*() {
    yield this.img || imageLib.get(IMAGES.DEBUG);
    yield this.x;
    yield this.y;
    if (this.size) {
      yield this.size;
      yield this.size;
    }
  };
}

//todo: make tileLib???
export const cursorTile = new Tile({
  size: cellSizePx,
  imageName: IMAGES.CURSOR,
});

export const debugTile = new Tile({
  size: cellSizePx,
  imageName: IMAGES.DEBUG,
});

export const cellTile = new Tile({
  size: cellSizePx,
  imageName: IMAGES.CELL,
});

export const crossTile = new Tile({
  size: cellSizePx,
  imageName: "x_startpoint.png",
});

const brushes = Object.entries(editor.brushes);

export const brushTiles = brushes.reduce(
  (tiles, [key, value], index) => ({
    ...tiles,
    [value]: new Tile({
      x: cellSizePx * index,
      y: 0,
      size: cellSizePx,
      //todo: 🐛bug here, fake image name tries to load as real image
      imageName: IMAGES.BRUSH_MARKERS,
    }),
  }),
  {}
);
