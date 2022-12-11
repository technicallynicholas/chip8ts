import Renderer from "../chip8emu/renderer";
import Speaker from "../chip8emu/speaker";

export default class Emulator {
  renderer: Renderer;
  constructor() {
    this.renderer = new Renderer(10);
    this.renderer.testRender();
  }
  draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    this.renderer.render(ctx);
  };
}
