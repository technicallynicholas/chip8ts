import React, { Component } from "react";
import Renderer from "../chip8emu/renderer";

export default class emuCanvas extends Component {
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
    } else {
      console.log("Canvas failed to attach.");
    }
  }

  componentDidMount(): void {
    this.setCanvasTarget("emuScreen");
  }
  render() {
    return (
      <div>
        <canvas id="emuScreen" width="640" height="320"></canvas>
      </div>
    );
  }
}
