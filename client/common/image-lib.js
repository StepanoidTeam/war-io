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

const brushes = Object.entries(editor.brushes);
imageLib.set(IMAGES.BRUSH_MARKERS, createBrushMarkers(brushes));

export { imageLib };
