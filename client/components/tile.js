import { getImage } from "../helpers/get-image.js";

const imageLib = new Map();
const debugImg = new Image();
debugImg.src =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAQklEQVRYR+3XsQ0AIAwDwfdoLA5slkgsEYr3Araucwo2sJjJSUEFMtH/uh2ggAIKKKCAAgoooIACCiigwA8Ck/f8Nr0lfWALag98AAAAAElFTkSuQmCC";

imageLib.set("debug", debugImg);

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
    yield this.img || debugImg;
    yield this.x;
    yield this.y;
    if (this.size) {
      yield this.size;
      yield this.size;
    }
  };
}

export const debugTile = new Tile({ size: 32, imageName: "debug" });
