import { useEffect, useRef } from "react";
import { getDirectionalColor } from "../utils";

export default function Legend() {
  const legendRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!legendRef.current) return;
    const canvas = legendRef.current;
    const context = canvas.getContext("2d");
    for (let i = 0; i < 2 * Math.PI * 100; i++) {
      context!.strokeStyle = getDirectionalColor(
        Math.cos(i / 100),
        Math.sin(i / 100)
      );
      context!.beginPath();
      context!.moveTo(50, 50);
      context!.lineTo(50 - Math.cos(i / 100) * 50, 50 + Math.sin(i / 100) * 50);
      context!.stroke();
    }
  }, []);

  return (
    <div className="mt-16 ml-4">
      <canvas ref={legendRef} width="100px" height="100px"></canvas>
    </div>
  );
}
