import React from "react";
import Renderer from "../chip8emu/renderer";
import Speaker from "../chip8emu/speaker";
import CPU from "./cpu";
import Keyboard from "./keyboard";

export default class Emulator {
  renderer: Renderer;
  keyboard: Keyboard;
  speaker: Speaker;
  cpu: CPU;

  constructor() {
    this.renderer = new Renderer(10);
    this.keyboard = new Keyboard();
    this.speaker = new Speaker();
    this.cpu = new CPU(this.renderer, this.keyboard, this.speaker);
    this.cpu.loadSpritesIntoMemory();
    this.cpu.loadRom("test_opcode.ch8");
    //fpsInterval = 1000 / fps;
    //then = Date.now();
    //startTime = then;
  }
  step = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    this.cpu.cycle();
    this.renderer.render(ctx);
  };
  processInput(event: React.KeyboardEvent) {
    console.log(event.code); // Deprecated, change how this is handled.
  }
}
