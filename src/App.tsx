import { useState } from "react";
import "./styles/App.css";
import Header from "./components/header";
import Canvas from "./components/canvas";

function App() {
  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#404040";
    ctx.beginPath();
    ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
    ctx.fill();
  };
  return (
    <div className="App">
      <Header />
      <Canvas draw={draw} width={640} height={320} />
    </div>
  );
}

export default App;
