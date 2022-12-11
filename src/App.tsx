import { useState } from "react";
import "./styles/App.css";
import Header from "./components/header";
import Canvas from "./components/canvas";
import Emulator from "./chip8emu/emulator";

function App() {
  const emulator = new Emulator();

  return (
    <div className="App">
      <Header />
      <Canvas draw={emulator.draw} width={640} height={320} />
    </div>
  );
}

export default App;
