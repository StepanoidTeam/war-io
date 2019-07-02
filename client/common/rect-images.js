import { IMAGES, imageLib } from "./image-lib.js.js";
import { editor } from "../config.js";

function createRectImage({ color, size = editor.cellSizePx }) {
  //const ctx = new OffscreenCanvas(size, size).getContext("2d");
  const ctx = document.createElement("canvas").getContext("2d");
  //debug
  //document.body.append(ctx.canvas);

  ctx.canvas.width = size;
  ctx.canvas.height = size;

  ctx.strokeStyle = color;
  ctx.strokeRect(0, 0, size, size);

  return ctx.canvas;
}

//generate rects
imageLib.set(IMAGES.DEBUG, createRectImage({ color: "red" }));
imageLib.set(IMAGES.CURSOR, createRectImage({ color: editor.cursorColor }));
imageLib.set(IMAGES.CELL, createRectImage({ color: "white" }));
