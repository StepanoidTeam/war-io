import { IMAGES, imageLib } from "./image-lib.js";
import { editor } from "../config.js";

//todo: bake all brush markers / text drawings here
(() => {
  //const ctx = new OffscreenCanvas(size, size).getContext("2d");
  const ctx = document.createElement("canvas").getContext("2d");
  //debug
  //document.body.append(ctx.canvas);

  const brushes = Object.entries(editor.brushes);

  const markerSize = 16;

  ctx.canvas.width = markerSize * brushes.length;
  ctx.canvas.height = markerSize;

  //setup canvas styles
  const fontSize = 14;
  const textOffset = { x: 4, y: 11 };
  ctx.font = `${fontSize}px Courier New`;

  //draw all markers
  const brushColors = {
    ice: "#97cfff",
    snow: "#ffffff",
    water: "#5995da",
    forest: "#87f9cf",
    rocks: "#ffb399",
  };
  brushes.forEach(([key, value], index) => {
    ctx.strokeStyle = ctx.fillStyle = brushColors[key];
    //ctx.strokeRect(index * markerSize, 0, markerSize, markerSize);
    ctx.fillText(value, index * markerSize + textOffset.x, textOffset.y);
  });

  imageLib.set(IMAGES.BRUSH_MARKERS, ctx.canvas);
})();
