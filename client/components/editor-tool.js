import { editor } from "../config.js";

export function EditorTool([type, tile]) {
  //making element
  const element = document.createElement("label");

  const radio = document.createElement("input");
  radio.type = "radio";
  radio.name = "surface"; //todo: get from params
  radio.value = type;
  element.append(radio);

  const img = new Image(editor.cellSizePx, editor.cellSizePx);
  element.append(img);

  //todo: refac
  element.brush = editor.brushes[type];

  (async function initImage() {
    await tile.whenReady;
    //todo: move to helper?
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.canvas.width = tile.size;
    ctx.canvas.height = tile.size;
    ctx.drawImage(...tile, 0, 0, tile.size, tile.size);
    img.src = ctx.canvas.toDataURL();
  })();

  return element;
}
