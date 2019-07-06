import { editor, brushColors, IMAGES } from "../config.js";
import { imageLib } from "./image-lib.js";

const { cellSizePx } = editor;

//todo: bake all brush markers / text drawings here
(() => {
  //const ctx = new OffscreenCanvas(size, size).getContext("2d");
  const ctx = document.createElement("canvas").getContext("2d");
  //debug
  //document.body.append(ctx.canvas);

  const brushes = Object.entries(editor.brushes);

  ctx.canvas.width = cellSizePx * brushes.length;
  ctx.canvas.height = cellSizePx;

  //setup canvas styles
  const fontSize = 28;
  const textOffset = { x: 8, y: 24 };
  ctx.font = `${fontSize}px Courier New`;

  brushes.forEach(([key, value], index) => {
    ctx.strokeStyle = ctx.fillStyle = brushColors[key];
    ctx.strokeRect(index * cellSizePx, 0, cellSizePx, cellSizePx);
    ctx.fillText(value, index * cellSizePx + textOffset.x, textOffset.y);
  });

  imageLib.set(IMAGES.BRUSH_MARKERS, ctx.canvas);
})();
