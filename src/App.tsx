import React, { useState } from "react";
import "./styles/App.css";
import Header from "./components/header";
import Canvas from "./components/canvas";
import Emulator from "./chip8emu/emulator";

function App() {
  const emulator = new Emulator();
  const handleInput = (kbEvent: React.KeyboardEvent<HTMLDivElement>) => {
    emulator.processInput(kbEvent);
  };
  return (
    <div className="App" tabIndex={0} onKeyDown={handleInput}>
      <Header />
      <Canvas draw={emulator.step} width={640} height={320} />
    </div>
  );
}

export default App;
