import { IMAGES, editor } from "../config.js";
import { createRectImage } from "../helpers/rect-images.js";
import { createBrushMarkers } from "./brush-markers.js";

const imageLib = new Map();

//generate rects

imageLib.set(
  IMAGES.DEBUG,
  createRectImage({ color: "red", size: editor.cellSizePx })
);
imageLib.set(
  IMAGES.CURSOR,
  createRectImage({ color: editor.cursorColor, size: editor.cellSizePx })
);
imageLib.set(
  IMAGES.CELL,
  createRectImage({ color: "white", size: editor.cellSizePx })
);

imageLib.set(
  IMAGES.OBSTACLE,
  createRectImage({ color: "#ff000040", size: editor.cellSizePx, fill: true })
);
imageLib.set(
  IMAGES.PASSABLE,
  createRectImage({ color: "#00ff0010", size: editor.cellSizePx, fill: true })
);

const brushes = Object.entries(editor.brushes);
imageLib.set(IMAGES.BRUSH_MARKERS, createBrushMarkers(brushes));

export { imageLib };
