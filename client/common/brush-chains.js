import { findSequence } from "./search-path.js";
import { editor } from "../config.js";

const brushSymbols = Object.values(editor.brushes);

export const brushChains = {};

for (let from of brushSymbols) {
  brushChains[from] = {};
  for (let to of brushSymbols) {
    brushChains[from][to] = findSequence({ from, to });
  }
}
