export default class Renderer {
  private ctx: CanvasRenderingContext2D;
  private resX: number;
  private resY: number;
  private scale: number;
  private cols: number;
  private rows: number;
  private bgColor: string; //TODO: properly handle bg and fgcolor as useroptions
  private fgColor: string;
  private display: Array<number>;

  constructor(
    canvasContext: CanvasRenderingContext2D,
    resolutionX: number,
    resolutionY: number,
    resolutionScale: number
  ) {
    //Initalization code.
    this.ctx = canvasContext;
    this.resX = resolutionX;
    this.resY = resolutionY;
    this.scale = resolutionScale;
    this.cols = 64;
    this.rows = 32;
    this.bgColor = "black";
    this.fgColor = "#ffbf00";
    this.display = new Array(this.cols, this.rows);
  }

  setPixel(x: number, y: number) {
    //The display wraps if x is greater or smaller than the bounds of the screen, per CHIP8 spec.
    if (x > this.cols) {
      x -= this.cols;
    } else if (x < 0) {
      x += this.cols;
    }
    //The display wraps if y is outside the bounds, just like x.
    if (y > this.rows) {
      y -= this.rows;
    } else if (y < 0) {
      y += this.rows;
    }
    //Location of the pixel to set.
    let pixelLoc = x + y * this.cols;
    //XOR the pixel data to the display, per the CHIP8 spec.
    this.display[pixelLoc] ^= 1;
    //Return the value of the operation. True if erase, false if not erased.
    return !this.display[pixelLoc];
  }
  clear() {
    //When clear is called just obliterate the array of display zero and create a new blank video buffer.
    this.display = new Array(this.cols * this.rows);
  }

  render() {
    //Blank the screen
    this.ctx.clearRect(0, 0, this.resX, this.resY);

    //Loop the display buffer
    for (let i = 0; i < this.cols * this.rows; i++) {
      //Value of x pixel
      let x = (i % this.cols) * this.scale;
      //value of y pixel
      let y = Math.floor(i / this.cols) * this.scale;
      //If the pixel data at this display buffer location is set, draw the pixel.
      if (this.display[i]) {
        //Set color to draw
        this.ctx.fillStyle = this.fgColor;
        //Draw pixel at position xy at current scale
        this.ctx.fillRect(x, y, this.scale, this.scale);
      }
    }
  }

  testRender() {
    this.setPixel(0, 0);
    this.setPixel(63, 31);
    console.log("Yassss");
  }
}
