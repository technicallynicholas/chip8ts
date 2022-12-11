import { useRef, useEffect } from "react";

const useCanvas = (draw: Function) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        let requestAnimationId: number;
        let counter = 0;
        const render = (ctx: CanvasRenderingContext2D) => {
          ctx.save();
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          draw(ctx, counter);
          ctx.restore();
          counter++;
          requestAnimationId = requestAnimationFrame(() => render(ctx));
        };
        render(context);
        return () => {
          cancelAnimationFrame(requestAnimationId);
        };
      }
    }
  });
  return canvasRef;
};

export default useCanvas;
