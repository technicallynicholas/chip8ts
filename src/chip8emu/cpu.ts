import Memory from "./memory";
import Renderer from "./renderer";
import Keyboard from "./keyboard";
import Speaker from "./speaker";

export default class CPU {
  //private memory: Memory;
  private memory: any;
  private v: any;
  private renderer: Renderer;
  private keyboard: Keyboard;
  private speaker: Speaker;
  private delayTimer: number;
  private soundTimer: number;
  private pc: any;
  private i: any;
  private stack: Array<number>;
  private paused: boolean;
  private speed: number;

  constructor(renderer: Renderer, keyboard: Keyboard, speaker: Speaker) {
    this.renderer = renderer;
    this.keyboard = keyboard;
    this.speaker = speaker;

    //Initialize 4KB of memory as an array
    this.memory = new Uint8Array(4096);

    //Initialize 16 8-bit registers
    this.v = new Uint8Array(16);

    //i is the current address register, initilized at 0
    this.i = 0;

    //Timers which will count down at 60hz when set
    this.delayTimer = 0;
    this.soundTimer = 0;

    //Initialize the program counter, program space starts at 0x200 as the first chunk is reserved for the interpreter.
    this.pc = 0x200;

    //Initialize the stack but leave it null to avoid invalid return types
    this.stack = new Array();

    //Variable for keeping track of if the CPU is paused
    this.paused = false;

    //The speed of the CPU stepping
    this.speed = 10;
  }

  loadSpritesIntoMemory() {
    //Sprites are 5 bytes, each byte represents a row of data 5 rows high. Each bit of a byte is that sprites 0 or 1 value as a column.
    const sprites = [
      0xf0,
      0x90,
      0x90,
      0x90,
      0xf0, // 0
      0x20,
      0x60,
      0x20,
      0x20,
      0x70, // 1
      0xf0,
      0x10,
      0xf0,
      0x80,
      0xf0, // 2
      0xf0,
      0x10,
      0xf0,
      0x10,
      0xf0, // 3
      0x90,
      0x90,
      0xf0,
      0x10,
      0x10, // 4
      0xf0,
      0x80,
      0xf0,
      0x10,
      0xf0, // 5
      0xf0,
      0x80,
      0xf0,
      0x90,
      0xf0, // 6
      0xf0,
      0x10,
      0x20,
      0x40,
      0x40, // 7
      0xf0,
      0x90,
      0xf0,
      0x90,
      0xf0, // 8
      0xf0,
      0x90,
      0xf0,
      0x10,
      0xf0, // 9
      0xf0,
      0x90,
      0xf0,
      0x90,
      0x90, // A
      0xe0,
      0x90,
      0xe0,
      0x90,
      0xe0, // B
      0xf0,
      0x80,
      0x80,
      0x80,
      0xf0, // C
      0xe0,
      0x90,
      0x90,
      0x90,
      0xe0, // D
      0xf0,
      0x80,
      0xf0,
      0x80,
      0xf0, // E
      0xf0,
      0x80,
      0xf0,
      0x80,
      0x80, // F
    ];

    //Load all of the sprites into memory from 0x000 to 0x1FF per the CHIP-8 Spec. (Just the length of the sprite array).
    for (let i = 0; i < sprites.length; i++) {
      this.memory[i] = sprites[i];
    }
  }

  loadProgramIntoMemory(program: Uint8Array) {
    //Loops through the program and stores it in memory starting at 0x200, the address that programs start.
    for (let loc = 0; loc < program.length; loc++) {
      this.memory[0x200 + loc] = program[loc];
      //console.log(`Memory Segment ${0x200 + loc}: ${(this.memory[0x200 + loc]).toString(16)}`);
    }
  }

  loadRom(romName: string) {
    //Function for loading a rom into JS memory, before our loadProgramIntoMemory function can place it in the emulator memory.
    var request = new XMLHttpRequest();
    var self = this;

    request.onload = function () {
      if (request.response) {
        let program = new Uint8Array(request.response);
        self.loadProgramIntoMemory(program);
      }
    };

    request.open("GET", `./roms/${romName}`);
    request.responseType = "arraybuffer";
    request.send();
  }

  cycle() {
    for (let i = 0; i < this.speed; i++) {
      if (!this.paused) {
        let opcode = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
        this.executeInstruction(opcode);
      }
    }

    if (!this.paused) {
      this.updateTimers();
    }

    this.playSound();
    //this.renderer.render(this.ctx);
  }

  updateTimers() {
    if (this.delayTimer > 0) {
      this.delayTimer -= 1;
    }
    if (this.soundTimer > 0) {
      this.soundTimer -= 1;
    }
  }

  playSound() {
    if (this.soundTimer > 0) {
      this.speaker.play(440);
    } else {
      this.speaker.stop();
    }
  }

  executeInstruction(opcode: number) {
    //Each instruction being two bytes, we advance the program counter 2 bytes per instruction
    this.pc += 2;
    //In a given 16 bit instruction, 0x1234, the 2nd and 3rd nibble are what we're after. Use bit shifting magic to isolate them into x and y.
    let x = (opcode & 0x0f00) >> 8;
    let y = (opcode & 0x00f0) >> 4;

    switch (opcode & 0xf000) {
      //Opcodes 0x0000 - 0x0FFF
      case 0x0000:
        switch (opcode) {
          case 0x00e0:
            this.renderer.clear();
            break;
          case 0x00ee:
            this.pc = this.stack.pop();
            break;
        }
        break;
      //Opcodes 0x1000 - 0x1FFF
      case 0x1000:
        this.pc = opcode & 0xfff;
        break;
      //Opcodes 0x2000 - 0x2FFF
      case 0x2000:
        this.stack.push(this.pc);
        this.pc = opcode & 0xfff;
        break;
      //Opcodes 0x3000 - 0x3FFF
      case 0x3000:
        if (this.v[x] === (opcode & 0xff)) {
          this.pc += 2;
        }
        break;
      //Opcodes 0x4000 - 0x4FFF
      case 0x4000:
        if (this.v[x] !== (opcode & 0xff)) {
          this.pc += 2;
        }
        break;
      //Opcodes 0x5000 - 0x5FFF
      case 0x5000:
        if (this.v[x] === this.v[y]) {
          this.pc += 2;
        }
        break;
      //Opcodes 0x6000 - 0x6FFF
      case 0x6000:
        this.v[x] = opcode & 0xff;
        break;
      //Opcodes 0x7000 - 0x7FFF
      case 0x7000:
        this.v[x] += opcode & 0xff;
        break;
      //Opcodes 0x8000 - 0x8FFF
      case 0x8000:
        switch (opcode & 0xf) {
          case 0x0:
            this.v[x] = this.v[y];
            break;
          case 0x1:
            this.v[x] |= this.v[y];
            break;
          case 0x2:
            this.v[x] &= this.v[y];
            break;
          case 0x3:
            this.v[x] ^= this.v[y];
            break;
          case 0x4:
            let sum = (this.v[x] += this.v[y]);
            this.v[0xf] = 0;
            if (sum > 0xff) {
              this.v[0xf] = 1;
            }
            this.v[x] = sum;
            break;
          case 0x5:
            this.v[0xf] = 0;
            if (this.v[x] > this.v[y]) {
              this.v[0xf] = 1;
            }
            this.v[x] -= this.v[y];
            break;
          case 0x6:
            this.v[0xf] = this.v[x] & 0x1;
            this.v[x] = this.v[y] >> 1;
            break;
          case 0x7:
            this.v[0xf] = 0;
            if (this.v[y] > this.v[x]) {
              this.v[0xf] = 1;
            }
            this.v[x] = this.v[y] - this.v[x];
            break;
          case 0xe:
            this.v[0xf] = (this.v[x] >> 7) & 1;
            this.v[x] = this.v[y] << 1;
            break;
        }
        break;
      //Opcodes 0x9000 - 0x9FFF
      case 0x9000:
        if (this.v[x] !== this.v[y]) {
          this.pc += 2;
        }
        break;
      //Opcodes 0xA000 - 0xAFFF
      case 0xa000:
        this.i = opcode & 0xfff;
        break;
      //Opcodes 0xB000 - 0xBFFF
      case 0xb000:
        this.pc = (opcode & 0xfff) + this.v[0];
        break;
      //Opcodes 0xC000 - 0xCFFF
      case 0xc000:
        let rand = Math.floor(Math.random() * 0xff);
        this.v[x] = rand & (opcode & 0xff);
        break;
      //Opcodes 0xD000 - 0xDFFF
      case 0xd000:
        let width = 8;
        let height = opcode & 0xf;
        this.v[0xf] = 0;
        for (let row = 0; row < height; row++) {
          let sprite = this.memory[this.i + row];
          for (let col = 0; col < width; col++) {
            if ((sprite & 0x80) > 0) {
              if (this.renderer.setPixel(this.v[x] + col, this.v[y] + row)) {
                this.v[0xf] = 1;
              }
            }
            sprite <<= 1;
          }
        }
        break;
      //Opcodes 0xE000 - 0xEFFF
      case 0xe000:
        switch (opcode & 0xff) {
          case 0x9e:
            if (this.keyboard.isKeyPressed(this.v[x])) {
              this.pc += 2;
            }
            break;
          case 0xa1:
            if (!this.keyboard.isKeyPressed(this.v[x])) {
              this.pc += 2;
            }
            break;
        }
        break;
      //Opcodes 0xF000 - 0xFFFF
      case 0xf000:
        switch (opcode & 0xff) {
          case 0x07:
            this.v[x] = this.delayTimer;
            break;
          case 0x0a:
            // this.paused = true;
            // this.keyboard.onNextKeyPress = function (key: any) {
            //   this.v[x] = key;
            //   this.paused = false;
            // }.bind(this);
            break;
          case 0x15:
            this.delayTimer = this.v[x];
            break;
          case 0x18:
            this.soundTimer = this.v[x];
            break;
          case 0x1e:
            this.i += this.v[x];
            break;
          case 0x29:
            this.i = this.v[x] * 5;
            break;
          case 0x33:
            this.memory[this.i] = parseInt(this.v[x]) / 100;
            this.memory[this.i + 1] = (parseInt(this.v[x]) % 100) / 10;
            this.memory[this.i + 2] = parseInt(this.v[x]) % 10;
            break;
          case 0x55:
            for (let registerIndex = 0; registerIndex <= x; registerIndex++) {
              this.memory[this.i + registerIndex] = this.v[registerIndex];
            }
            break;
          case 0x65:
            for (let registerIndex = 0; registerIndex <= x; registerIndex++) {
              this.v[registerIndex] = this.memory[this.i + registerIndex];
            }
            break;
        }
        break;
      //If the opcode somehow isn't any of the above.
      default:
        throw new Error(`Unknown opcode: ${opcode}`);
    }
  }
}
