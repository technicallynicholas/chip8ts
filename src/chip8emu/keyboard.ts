import React, { KeyboardEvent } from "react";

class Keyboard {
  KEYMAP: any;
  onNextKeyPress: any;
  keysPressed: Array<boolean>;

  constructor() {
    this.KEYMAP = {
      49: 0x1, //1
      50: 0x2, //2
      51: 0x3, //3
      52: 0xc, //4
      81: 0x4, //Q
      87: 0x5, //W
      69: 0x6, //E
      82: 0xd, //R
      65: 0x7, //A
      83: 0x8, //S
      68: 0x9, //D
      70: 0xe, //F
      90: 0xa, //Z
      88: 0x0, //X
      67: 0xb, //C
      86: 0xf, //V
    };

    this.keysPressed = [];

    this.onNextKeyPress = null;

    // window.addEventListener("keydown", this.onKeyDown.bind(this), false);
    // window.addEventListener("keyup", this.onKeyUp.bind(this), false);
  }

  isKeyPressed(keyCode: any) {
    return this.keysPressed[keyCode];
  }

  onKeyDown(event: React.KeyboardEvent) {
    let key = this.KEYMAP[event.keyCode];
    this.keysPressed[key] = true;

    if (this.onNextKeyPress !== null && key) {
      this.onNextKeyPress(parseInt(key));
      this.onNextKeyPress = null;
    }
  }

  onKeyUp(event: React.KeyboardEvent) {
    let key = this.KEYMAP[event.keyCode];
    this.keysPressed[key] = false;
  }
}

export default Keyboard;
