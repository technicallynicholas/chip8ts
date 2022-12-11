import { useEffect, useRef } from "react";
import useCanvas from "./hooks/useCanvas";

interface CanvasProps {
  draw: Function;
  width: number;
  height: number;
}

const Canvas = (props: CanvasProps) => {
  const { draw, ...rest } = props;
  const canvasRef = useCanvas(draw);

  return <canvas ref={canvasRef} width={props.width} height={props.height} />;
};

export default Canvas;
