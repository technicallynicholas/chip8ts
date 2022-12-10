import { useState } from "react";
import "./styles/App.css";
import Header from "./components/header";
import EmuCanvas from "./components/emuCanvas";

function App() {
  return (
    <div className="App">
      <Header />
      <EmuCanvas />
    </div>
  );
}

export default App;
