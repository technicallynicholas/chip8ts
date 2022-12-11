import Renderer from "../chip8emu/renderer";
import Speaker from "../chip8emu/speaker";

export default class Emulator {
  constructor() {}

  setCanvasTarget(canvasId: string) {
    const canvas = document.getElementById(canvasId);
    console.log(canvas);
    if (canvas instanceof HTMLCanvasElement) {
      canvas.style.backgroundColor = "black";
      const renderer = new Renderer(
        canvas.getContext("2d")!,
        canvas.width,
        canvas.height,
        10
      );
      renderer.testRender();
      renderer.render();
      const speaker = new Speaker();
      speaker.play(440);
    } else {
      console.log("Canvas failed to attach.");
    }
  }
}
