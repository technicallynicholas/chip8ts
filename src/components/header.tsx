import React, { Component } from "react";

export default class header extends Component {
  render() {
    return (
      <section>
        <div className="px-8 pt-8 pb-2 bg-gray-600">
          <div className="pb-6 border-b-2 border-gray-500">
            <h2 className="text-2xl font-bold text-white tracking-wide leading-6 mb-1">
              Chip8 TypeScript Emulator
            </h2>
          </div>
        </div>
      </section>
    );
  }
}
