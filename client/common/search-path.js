import { editor } from "../config.js";
import { winterTileSet } from "../tilesets.js";

const brushSymbols = Object.values(editor.brushes);

const brushGraph = [
  ...brushSymbols.map(() => new Array(brushSymbols.length).fill(0)),
];

//get unique brush pairs from tileset
const brushPairs = new Set(
  Object.keys(winterTileSet)
    .map(tileCode => [...new Set(tileCode)].sort().join(""))
    .filter(pair => pair.length > 1)
);

console.log("pairs", brushSymbols, brushPairs);

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

console.log("bg", brushGraph);

function getNodes(from, skip = []) {
  const fi = brushSymbols.indexOf(from);
  const nodes = brushGraph[fi]
    .map((isOpen, index) => ({ isOpen, index, char: brushSymbols[index] }))
    .filter(n => !skip.includes(n.char))
    .filter(n => n.isOpen);
  return nodes;
}

function findSequence({ from, to }) {
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

  console.log("⛔️path not found");
  return null;
}

console.log("⚠️tests");
function test(fn, input, output) {
  const result = fn(input);
  const passed = JSON.stringify(result) === JSON.stringify(output);

  console[passed ? "groupCollapsed" : "group"](
    passed ? "✅passed" : "❌failed",
    fn.name,
    input
  );
  console.log("expected", output);
  console.log("to equal", result);
  console.groupEnd();
}

test(findSequence, { from: "f", to: "W" }, ["f", "s", "i", "w", "W"]);
test(findSequence, { from: "i", to: "W" }, ["i", "w", "W"]);
test(findSequence, { from: "f", to: "i" }, ["f", "s", "i"]);
test(findSequence, { from: "W", to: "f" }, ["W", "w", "i", "s", "f"]);
test(findSequence, { from: "I", to: "f" }, ["I", "i", "s", "f"]);
test(findSequence, { from: "S", to: "w" }, ["S", "s", "i", "w"]);
test(findSequence, { from: "s", to: "s" }, ["s"]);
test(findSequence, { from: "s", to: "X" }, null);
