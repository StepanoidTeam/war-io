import { SurfaceMap } from "./components/map/surface-map.js";
import { debug, editor } from "./config.js";
import { cursor } from "./components/cursor.js";
import { MiniMap } from "./components/mini-map.js";
import { CanvasCleaner } from "./components/canvas-cleaner.js";
import { TileMap } from "./components/map/tile-map.js";
import { StructureMap } from "./components/map/structure-map.js";
import {
  wallTileSet,
  surfaceTileSet,
  farmTileSet,
} from "./common/tilesets/tilesets.js";
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
import { unitsMap } from "./components/units-map.js";
import { WallHuman, WallOrc } from "./components/structures/wall.js";
import { Farm } from "./components/structures/farm.js";

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
  const structureMap = new StructureMap();

  //remove walls if they were painted out by surface
  TileCell.onChange(tileCell => {
    if (tileCell.canBuild === false) {
      structureMap.deleteStructure({
        x: tileCell.props.col,
        y: tileCell.props.row,
      });
    }
  });

  //remove units if they were painted out by surface
  TileCell.onChange(tileCell => {
    if (tileCell.isObstacle === true) {
      unitsMap.deleteUnit({ x: tileCell.props.col, y: tileCell.props.row });
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
    structures: createMapLayer(),
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
    [new CanvasCleaner(), layers.structures],
    [tileMap, layers.tiles],
    //todo: make separate layer for walls?
    [structureMap, layers.tiles],
    [surfaceMap, layers.overlay],
    [miniMap, layers.tiles],
    [cursor, layers.overlay],
    [unitsMap, layers.units],
    [unitsMap, layers.structures],
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

  //STRUCTURES

  const structureCallback = $class => () => {
    cursor.offset = cellSizePx / 2;
    editor.brushSize = $class.size;
    cursor.tile = $class.icon; //todo: create separate field for that

    editor.currentTool = (x, y) => {
      //todo: should not be strictly linked to surface map
      if (structureMap.collides({ x, y, size: $class.size })) return;
      if (unitsMap.collides({ x, y, size: $class.size })) return;
      //todo: can check if not buildable - only then put snow
      //buildable check missing ⚠️
      surfaceMap.paint({
        col: x,
        row: y,
        brush: editor.brushes.snow,
        brushSize: $class.size + 1,
      });

      structureMap.paint(x, y, $class);
    };
  };

  [WallOrc, WallHuman, Farm]
    .map($class =>
      EditorTool({
        tile: $class.icon,
        groupName: "surface",
        value: $class.name, //redundant
        callback: structureCallback($class),
      })
    )
    .forEach(t => toolBox.append(t));

  // UNIT tools
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
    value: "peasant-human",
    callback: () => {
      cursor.offset = cellSizePx / 2;
      cursor.tile = peasantTile;
      editor.currentTool = (x, y) => {
        if (tileMap.tileCells[y][x].isObstacle) return;
        if (structureMap.collides({ x, y, size: Peasant.size })) return;
        if (unitsMap.collides({ x, y, size: Peasant.size })) return;

        unitsMap.paint(x, y, Peasant);
      };
    },
  });

  toolBox.append(addPeasantTool);

  //remove tool
  const removeUnitAndWallTool = EditorTool({
    tile: crossTile,
    groupName: "surface",
    value: "delete",
    callback: () => {
      cursor.offset = cellSizePx / 2;
      cursor.tile = debugTile;
      editor.currentTool = (x, y) => {
        structureMap.deleteStructure({ x, y });
        unitsMap.deleteUnit({ x, y });
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
      editor.currentTool = (x, y) => {
        const unit = unitsMap.getUnit({ x, y });
        const structure = structureMap.getStructure({ x, y });

        const entity = structure || unit;

        if (entity) {
          showEditor(entity);
          console.log(entity);
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
