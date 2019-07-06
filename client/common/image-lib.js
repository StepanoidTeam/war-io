import { IMAGES, editor } from "../config.js";
import { createRectImage } from "./rect-images.js";
import { createBrushMarkers } from "./brush-markers.js";

const imageLib = new Map();

//generate rects
imageLib.set(IMAGES.DEBUG, createRectImage({ color: "red" }));
imageLib.set(IMAGES.CURSOR, createRectImage({ color: editor.cursorColor }));
imageLib.set(IMAGES.CELL, createRectImage({ color: "white" }));

const brushes = Object.entries(editor.brushes);
imageLib.set(IMAGES.BRUSH_MARKERS, createBrushMarkers(brushes));

export { imageLib };
