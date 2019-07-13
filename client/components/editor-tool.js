import { editor } from "../config.js";

export async function EditorTool([type, tile]) {
  await tile.whenReady;

  const img = new Image(editor.cellSizePx, editor.cellSizePx);

  const ctx = document.createElement("canvas").getContext("2d");
  ctx.canvas.width = tile.size;
  ctx.canvas.height = tile.size;

  ctx.drawImage(...tile, 0, 0, tile.size, tile.size);

  //making element

  img.src = ctx.canvas.toDataURL();

  const element = document.createElement("label");

  const radio = document.createElement("input");
  radio.type = "radio";
  radio.name = "surface";
  radio.value = type;

  element.append(radio);
  element.append(img);

  element.brush = editor.brushes[type];

  //element.style.backgroundImage = `url( ${ctx.canvas.toDataURL()})`;

  return element;
}
