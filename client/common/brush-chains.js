import { editor } from "../config.js";

// brush/layer dependency order
//todo: these could be generated programmatically (somehow)
export const brushChains = {
  [editor.brushes.water]: [
    editor.brushes.ice, //
    editor.brushes.waterDark,
    editor.brushes.water,
  ],
  [editor.brushes.snow]: [
    editor.brushes.ice, //
    editor.brushes.forest,
    editor.brushes.snowDark,
    editor.brushes.snow,
  ],
  [editor.brushes.forest]: [
    editor.brushes.snow, //
    editor.brushes.forest,
  ],

  [editor.brushes.ice]: [
    // BUG: rocks/dark ice on dark water fails
    editor.brushes.snow, //
    editor.brushes.water, //todo: for water-dark only use water instead of snow
    editor.brushes.rocks,
    editor.brushes.iceDark,
    editor.brushes.ice,
  ],
  [editor.brushes.rocks]: [
    editor.brushes.ice, //
    editor.brushes.rocks,
  ],

  [editor.brushes.iceDark]: [
    editor.brushes.ice, //
    editor.brushes.iceDark,
  ],

  [editor.brushes.snowDark]: [
    editor.brushes.snow, //
    editor.brushes.snowDark,
  ],
  [editor.brushes.waterDark]: [
    editor.brushes.water, //
    editor.brushes.waterDark,
  ],
};
