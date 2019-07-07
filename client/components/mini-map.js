export class MiniMap {
  constructor({ width, height }) {
    const ctx = document.createElement("canvas").getContext("2d");

    ctx.canvas.width = width;
    ctx.canvas.height = height;

    this.ctx = ctx;
  }

  draw(ctx) {
    this.ctx.drawImage(
      ctx.canvas,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
  }
}
