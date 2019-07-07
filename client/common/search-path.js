import { editor } from "../config.js";
import { brushPairs } from "./tilesets/tilesets.js";

export const brushSymbols = Object.values(editor.brushes);

function initBrushGraph() {
  const brushGraph = [
    ...brushSymbols.map(() => new Array(brushSymbols.length).fill(0)),
  ];

  for (let [a, b] of brushPairs) {
    const ai = brushSymbols.indexOf(a);
    const bi = brushSymbols.indexOf(b);

    if (ai < 0 || bi < 0) {
      console.warn(`⚠️ unknown brush ${a + b}`);
      continue;
    }

    brushSymbols.indexOf(a);
    brushGraph[ai][bi] = 1;
    brushGraph[bi][ai] = 1;
  }

  return brushGraph;
}

const brushGraph = initBrushGraph();

function getNodes(from, skip = []) {
  const fi = brushSymbols.indexOf(from);
  const nodes = brushGraph[fi]
    .map((isOpen, index) => ({ isOpen, index, char: brushSymbols[index] }))
    .filter(n => !skip.includes(n.char))
    .filter(n => n.isOpen);
  return nodes;
}

export function findSequence({ from, to }) {
  const result = [];
  const used = [];

  function findAt(current) {
    //console.log("at", current);
    used.push(current);

    if (current === to) {
      return true;
    } //found end

    const nodes = getNodes(current, used);
    if (nodes.length === 0) return false; // no children - return nothing?
    //console.log(nodes);
    for (let node of nodes) {
      if (findAt(node.char, used)) {
        result.unshift(node.char);
        return true;
      }
    }
  }

  if (findAt(from)) {
    result.unshift(from);
    return result;
  }

  console.log(`⛔️path not found from: ${from} to: ${to}`);
  return null;
}
