import { loadTileSet } from "../tilesets.js";
import { editor } from "../../../config.js";
import { Unit } from "../../../components/map/units/unit.js";

const unitImgSize = 72;

export const peasantImgSetConfig = {
  sourceSize: unitImgSize,
  sourceOffset: 0,
  cols: 5,
  rows: 13,
};

const { cellSizePx } = editor;

export const peasantCodes = {
  ["all"]: [[0, 64]],
  ["stand"]: [[0, 4]],
  //walk
  ["walk-up"]: [0, 5, 10, 15, 20],
  ["walk-up-right"]: [1, 6, 11, 16, 21],
  ["walk-right"]: [2, 7, 12, 17, 22],
  ["walk-down-right"]: [3, 8, 13, 18, 23],
  ["walk-down"]: [4, 9, 14, 19, 24],
  //clones //todo: swap horizontaly⚠️
  ["walk-down-left"]: [3, 8, 13, 18, 23],
  ["walk-left"]: [2, 7, 12, 17, 22],
  ["walk-up-left"]: [1, 6, 11, 16, 21],
  //hatch
  ["hatch-up"]: [25, 30, 35, 40, 45],
  ["hatch-up-right"]: [26, 31, 36, 41, 46],
  ["hatch-right"]: [27, 32, 37, 42, 47],
  ["hatch-down-right"]: [28, 33, 38, 43, 48],
  ["hatch-down"]: [29, 34, 39, 44, 49],
  //clones //todo: swap horizontaly⚠️
  ["hatch-down-left"]: [28, 33, 38, 43, 48],
  ["hatch-left"]: [27, 32, 37, 42, 47],
  ["hatch-up-left"]: [26, 31, 36, 41, 46],
  //die
  ["die-up"]: [50, 50, 55, 55, 60, 60, 60], //todo: tweak speed?
  ["die-up-right"]: [51, 56, 61],
  ["die-right"]: [52, 57, 62],
  ["die-down-right"]: [53, 58, 63],
  ["die-down"]: [54, 59, 64],
  //clones //todo: swap horizontaly⚠️
  ["die-down-left"]: [53, 58, 63],
  ["die-left"]: [52, 57, 62],
  ["die-up-left"]: [51, 56, 61],
};

export const peasantTileSet = Object.entries(peasantCodes).reduce(
  (acc, [key, value]) => {
    acc[key] = loadTileSet({
      imageName: "units/peasant.png",
      ranges: value,
      imgSetConfig: peasantImgSetConfig,
    });
    return acc;
  },
  {}
);

//todo: extract
export class Peasant extends Unit {
  tileCodes = Object.keys(peasantCodes);
  //todo: animation?
  frameIndex = 0;
  ticks = 0;

  constructor(props) {
    super(props);

    this.ticksPerFrame = props.ticksPerFrame || 10; //60/4 = 15fps
    this.setAnimation(props.animation);
  }

  setAnimation(animation) {
    this.animation = animation;
    this.tiles = peasantTileSet[this.animation];
    this.ticks = 0;
    this.frameIndex = 0;
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(ctx) {
    //anim logic - refac
    if (this.cooldown > 0) {
      this.cooldown--;
    } else {
      this.ticks++;
    }
    if (this.ticks > this.ticksPerFrame) {
      this.ticks = 0;
      this.frameIndex++;

      if (this.frameIndex >= this.tiles.length) {
        this.frameIndex = 0;
        this.cooldown = 0;
      }
    }

    const offset = cellSizePx - unitImgSize / 2;
    const posProps = [
      this.x * cellSizePx + offset,
      this.y * cellSizePx + offset,
      unitImgSize,
      unitImgSize,
    ];

    ctx.drawImage(...this.tiles[this.frameIndex], ...posProps);
  }
}
