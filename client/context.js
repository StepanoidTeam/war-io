import { editor } from "./config.js";

const { mapSize, cellSizePx } = editor;

const canvas = document.querySelector("#canvas");
export const ctx = canvas.getContext("2d");

//set canvas size
ctx.canvas.height = mapSize * cellSizePx;
ctx.canvas.width = mapSize * cellSizePx;
