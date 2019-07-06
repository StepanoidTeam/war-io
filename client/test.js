import { findSequence } from "./common/search-path.js";

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
