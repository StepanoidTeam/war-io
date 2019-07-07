const debugMode = false;

export function createRectImage({ color, size }) {
  let ctx;
  if (debugMode) {
    ctx = document.createElement("canvas").getContext("2d");
    document.body.append(ctx.canvas);
  } else {
    ctx = new OffscreenCanvas(size, size).getContext("2d");
  }

  ctx.canvas.width = size;
  ctx.canvas.height = size;

  ctx.strokeStyle = color;
  ctx.strokeRect(0, 0, size, size);

  return ctx.canvas;
}
