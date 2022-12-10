export default class Renderer {
  private ctx: CanvasRenderingContext2D;
  private resX: number;
  private resY: number;
  private scale: number;

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
  }

  setPixel(x: number, y: number) {
    //SetPixel function
  }
}
