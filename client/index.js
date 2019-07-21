import { SurfaceMap } from "./components/map/surface-map.js";
import { debug, editor } from "./config.js";
import { cursor } from "./components/cursor.js";
import { MiniMap } from "./components/mini-map.js";
import { CanvasCleaner } from "./components/canvas-cleaner.js";
import { TileMap } from "./components/map/tile-map.js";
import { WallMap } from "./components/map/wall-map.js";
import { wallTileSet, surfaceTileSet } from "./common/tilesets/tilesets.js";
import { EditorTool } from "./components/editor-tool.js";
import { Status } from "./components/status.js";
import {
  brushTiles,
  cursorTile,
  crossTile,
  debugTile,
} from "./components/tile.js";
import { TileCell } from "./components/map/tile-cell.js";
import { Peasant, peasantTileSet } from "./common/tilesets/units/peasant.js";
import { showEditor } from "./unit-editor.js";

const { cellSizePx, mapSize } = editor;

function getColRowFromMouseEvent(event) {
  const { layerX, layerY } = event;
  const col = Math.floor((layerX - cursor.offset) / cellSizePx);
  const row = Math.floor((layerY - cursor.offset) / cellSizePx);

  return [col, row];
}

(async () => {
  const surfaceMap = new SurfaceMap({
    size: { rows: mapSize, cols: mapSize },
    ininitalBrush: editor.brushes.snow,
  });

  const canvasSize = mapSize * cellSizePx;
  //canvas container
  const mapContainer = document.getElementById("map-container");
  mapContainer.style.width = `${canvasSize}px`;
  mapContainer.style.height = `${canvasSize}px`;

  const tileMap = new TileMap({ surfaceTypeCells: surfaceMap.cells });
  const wallMap = new WallMap(wallTileSet);

  const units = [
    new Peasant({ x: 1, y: 1, animation: "walk-up" }),
    new Peasant({ x: 4, y: 4, animation: "walk-right" }),
    new Peasant({ x: 10, y: 4, animation: "hatch-up" }),
    new Peasant({ x: 4, y: 11, animation: "die-up" }),
  ];

  //todo: extract?
  const unitsMap = {
    units,
    getUnitIndex(x, y) {
      const unitIndex = this.units.findIndex(u => u.x === x && u.y === y);
      return unitIndex;
    },
    getUnit(x, y) {
      return this.units.find(u => u.x === x && u.y === y);
    },
    paint({ x, y, unit }) {
      if (tileMap.tileCells[y][x].isObstacle) return;

      const unitIndex = this.getUnitIndex(x, y);
      if (unitIndex < 0)
        this.units.push(new unit({ x, y, animation: "walk-up" }));
    },
    erase(x, y) {
      const unitIndex = this.getUnitIndex(x, y);
      if (unitIndex >= 0) this.units.splice(unitIndex, 1);
    },
    draw(ctx) {
      this.units.forEach(u => u.draw(ctx));
    },
  };
  //remove walls if they were painted out by surface
  TileCell.onChange(tileCell => {
    if (tileCell.canBuild === false) {
      wallMap.erase(tileCell.props.col, tileCell.props.row);
    }
  });

  //remove units if they were painted out by surface
  TileCell.onChange(tileCell => {
    if (tileCell.isObstacle === true) {
      unitsMap.erase(tileCell.props.col, tileCell.props.row);
    }
  });

  function createMapLayer() {
    const ctxLayer = document.createElement("canvas").getContext("2d");
    ctxLayer.canvas.height = canvasSize;
    ctxLayer.canvas.width = canvasSize;

    //todo: move outside?
    mapContainer.append(ctxLayer.canvas);

    return ctxLayer;
  }

  const layers = {
    tiles: createMapLayer(),
    overlay: createMapLayer(),
    units: createMapLayer(),
  };

  function paint(col, row) {
    if (!isDrawing) return;

    editor.currentTool(col, row);
  }

  let isDrawing = false;
  //todo: hanlde events better
  //not sure, should i bind on canvas or mb on whole container?
  mapContainer.addEventListener("mousedown", () => {
    isDrawing = true;
  });

  mapContainer.addEventListener("mouseup", () => {
    isDrawing = false;
  });

  mapContainer.addEventListener("mousemove", event => {
    const [col, row] = getColRowFromMouseEvent(event);
    cursor.move(col, row);

    status.update(col, row);

    paint(col, row);
  });

  mapContainer.addEventListener("click", event => {
    isDrawing = true;
    const [col, row] = getColRowFromMouseEvent(event);
    //todo: doesn't work - fix
    paint(col, row);
    isDrawing = false;
  });

  const miniMap = new MiniMap({
    width: cellSizePx * 4,
    height: cellSizePx * 4,
  });

  const status = new Status(document.querySelector(".status-bar"));

  const miniMapContainer = document.getElementById("mini-map-container");
  miniMapContainer.append(miniMap.ctx.canvas);

  const drawables = [
    [new CanvasCleaner(), layers.tiles],
    [new CanvasCleaner(), layers.overlay],
    [new CanvasCleaner(), layers.units],
    [tileMap, layers.tiles],
    //todo: make separate layer for walls?
    [wallMap, layers.tiles],
    [surfaceMap, layers.overlay],
    [miniMap, layers.tiles],
    [cursor, layers.overlay],
    [unitsMap, layers.units],
  ];

  requestAnimationFrame(function render() {
    drawables.forEach(([component, context]) => component.draw(context));
    requestAnimationFrame(render);
  });

  //editor tools
  const toolBox = document.querySelector(".tool-box");

  //debugTile, crossTile,

  // init surface tools
  // explicit declaration to keep proper order (not obj.entries)
  [
    "forest",
    "rocks",
    "snow",
    "snowDark",
    "ice",
    "iceDark",
    "water",
    "waterDark",
  ]
    .map(type => [type, editor.brushes[type]])
    .map(([type, brush]) =>
      EditorTool({
        tile: surfaceTileSet[brush.repeat(4)][0],
        groupName: "surface",
        value: type,
        callback: () => {
          cursor.offset = 0;
          cursor.tile = brushTiles[brush];
          editor.currentTool = (col, row) => {
            const totalCells = surfaceMap.paint({
              col,
              row,
              brush,
              brushSize: editor.brushSize,
            });

            //console.log("cells", totalCells.length);

            //todo: get tilecells affected
          };
        },
      })
    )
    .forEach(elem => toolBox.append(elem));

  // human wall tool
  const humanWallTool = EditorTool({
    tile: wallTileSet["human-0000"][0],
    groupName: "surface",
    value: "wall-human",
    callback: () => {
      cursor.offset = cellSizePx / 2;
      cursor.tile = cursorTile;
      editor.currentTool = (col, row) => {
        //todo: should not be strictly linked to surface map

        //todo: can check if not buildable - only then put snow
        surfaceMap.paint({
          col,
          row,
          brush: editor.brushes.snow,
          brushSize: 2,
        });

        wallMap.paint(col, row, WallMap.TYPES.HUMAN);
      };
    },
  });

  toolBox.append(humanWallTool);

  // human wall tool
  const orcWallTool = EditorTool({
    tile: wallTileSet["orc-0000"][0],
    groupName: "surface",
    value: "wall-orc",
    callback: () => {
      cursor.offset = cellSizePx / 2;
      cursor.tile = cursorTile;
      editor.currentTool = (col, row) => {
        //todo: should not be strictly linked to surface map

        //todo: can check if not buildable - only then put snow
        surfaceMap.paint({
          col,
          row,
          brush: editor.brushes.snow,
          brushSize: 2,
        });

        wallMap.paint(col, row, WallMap.TYPES.ORC);
      };
    },
  });

  toolBox.append(orcWallTool);

  //draw peasant
  const peasantTile = peasantTileSet["stand"][0];
  peasantTile.size = cellSizePx;
  //72 - unit tile size
  //todo: ⚠️ this breaks the tile!11
  peasantTile.x = 72 / 2 - cellSizePx / 2;
  peasantTile.y = 72 / 2 - cellSizePx / 2;

  // peasant tool
  const addPeasantTool = EditorTool({
    tile: peasantTile,
    groupName: "surface",
    value: "peasant",
    callback: () => {
      cursor.offset = cellSizePx / 2;
      cursor.tile = peasantTile;
      editor.currentTool = (x, y) => {
        unitsMap.paint({
          x,
          y,
          unit: Peasant,
        });
      };
    },
  });

  toolBox.append(addPeasantTool);

  //remove wall tool
  const removeUnitAndWallTool = EditorTool({
    tile: crossTile,
    groupName: "surface",
    value: "wall-erase",
    callback: () => {
      cursor.offset = cellSizePx / 2;
      cursor.tile = debugTile;
      editor.currentTool = (col, row) => {
        wallMap.erase(col, row);
        unitsMap.erase(col, row);
      };
    },
  });

  toolBox.append(removeUnitAndWallTool);

  //select unit tool
  const selectionTool = EditorTool({
    tile: debugTile,
    groupName: "surface",
    value: "select",
    callback: () => {
      cursor.offset = cellSizePx / 2;
      cursor.tile = debugTile;
      editor.currentTool = (col, row) => {
        const unit = unitsMap.getUnit(col, row);
        const wall = wallMap.getWall(col, row);

        if (wall || unit) {
          showEditor(unit);
          console.log(unit, wall);
        }
      };
    },
  });

  toolBox.append(selectionTool);
  //
})();

//dat-gui
const gui = new dat.GUI();
gui.add(editor, "brushSize", 1, 3).step(1);
gui.add(debug, "showCollides");
gui.add(debug, "showCellTypes");
gui.add(debug, "renderTiles");
