import React, { Component } from "react";

export default class emuCanvas extends Component {
  render() {
    return (
      <div>
        <canvas id="emuScreen" width="640" height="320"></canvas>
      </div>
    );
  }
}
