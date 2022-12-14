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
          counter++;
          draw(ctx, counter);
          requestAnimationId = window.requestAnimationFrame(() => render(ctx));
        };
        render(context);
        return () => {
          window.cancelAnimationFrame(requestAnimationId);
        };
      }
    }
  }, [draw]);
  return canvasRef;
};

export default useCanvas;
