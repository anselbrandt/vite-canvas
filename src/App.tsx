import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [video, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [canvas, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const timestamp = useRef<number>(0);

  useEffect(() => {
    if (!video) return;
    if (!canvas) return;
    const render = (current: number) => {
      timestamp.current = current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");

      context?.drawImage(
        video,
        0,
        0,
        video.videoWidth,
        video.videoHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );
      requestAnimationFrame(render);
    };
    video.addEventListener("loadeddata", () => {
      requestAnimationFrame(render);
    });
    return () => {
      video.removeEventListener("loadeddata", () => {
        cancelAnimationFrame(timestamp.current);
      });
    };
  }, [video, canvas]);

  return (
    <div>
      <div>
        <video
          ref={setVideoRef}
          id="video"
          src="/test.mp4"
          autoPlay
          loop
          muted
          playsInline
          controls
        />
      </div>
      <div>
        <canvas ref={setCanvasRef} />
      </div>
    </div>
  );
}

export default App;
