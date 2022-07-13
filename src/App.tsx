import { GPU } from "gpu.js";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import Controls from "./components/controls";
import Legend from "./components/legend";
import { getDirectionalColor } from "./utils";
import { generateZones, kernelFunction } from "./utils/flow";

function App() {
  const [video, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [canvas, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const timestamp = useRef<number>(0);
  const lastPixels = useRef<Uint8ClampedArray>();
  const [size, setSize] = useState({ width: 640, height: 480 });
  const qualityRef = useRef(10);
  const [quality, setQuality] = useState(10);
  const transparencyRef = useRef(1);
  const [transparency, setTransparency] = useState(1);
  const maxFlowRef = useRef(100);
  const [maxFlow, setMaxFlow] = useState(100);
  const minFlowRef = useRef(0);
  const [minFlow, setMinFlow] = useState(0);
  const monochromeRef = useRef(false);
  const [monochrome, setMonochrome] = useState(false);
  const histogramRef = useRef(true);
  const [histogram, setHistogram] = useState(true);
  const zonesRef = useRef<Float32Array[]>();
  const [zonesLength, setZonesLength] = useState<number>();
  const [data, setData] = useState<any[]>();
  const [hasPrinted, setHasPrinted] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartTimestamp = useRef(0);

  const handleQuality: ChangeEventHandler<HTMLInputElement> = (event) => {
    qualityRef.current = +event.target.value;
    setQuality(+event.target.value);
  };

  const handleMaxFlow: ChangeEventHandler<HTMLInputElement> = (event) => {
    maxFlowRef.current = +event.target.value;
    setMaxFlow(+event.target.value);
  };

  const handleMinFlow: ChangeEventHandler<HTMLInputElement> = (event) => {
    minFlowRef.current = +event.target.value;
    setMinFlow(+event.target.value);
  };

  const handleTransparency: ChangeEventHandler<HTMLInputElement> = (event) => {
    transparencyRef.current = +event.target.value / 100;
    setTransparency(+event.target.value / 100);
  };

  const handleMonochrome = () => {
    monochromeRef.current = !monochrome;
    setMonochrome(!monochrome);
  };
  const handleHistogram = () => {
    histogramRef.current = !histogram;
    setHistogram(!histogram);
  };

  useEffect(() => {
    if (!video) return;
    if (!canvas) return;

    zonesRef.current = generateZones(
      size.width,
      size.height,
      qualityRef.current
    );

    setZonesLength(zonesRef.current.length);

    const gpu = new GPU({});

    const render = (current: number) => {
      if (!zonesRef.current) return;

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

      const image = context?.getImageData(0, 0, canvas.width, canvas.height);

      const pixels = image?.data;

      if (pixels && lastPixels.current && context) {
        const kernel = gpu
          .createKernel(kernelFunction as any)
          .setOutput([zonesRef.current.length])
          .setTactic("balanced");

        const flow = kernel(
          lastPixels.current,
          pixels,
          zonesRef.current,
          quality,
          canvas.width
        ) as [];

        context.beginPath();
        context.rect(0, 0, canvas.width, canvas.height);
        context.fillStyle = `rgba(0, 0, 0, ${transparencyRef.current})`;
        context.fill();

        let scalers = Array(size.width).fill(0);

        for (let i = 0; i < flow.length; i++) {
          const zone = flow[i];
          const x = zone[0];
          const y = zone[1];
          const u = zone[2];
          const v = zone[3];
          const scaler = Math.sqrt(u * u + v * v);

          if (scaler < maxFlowRef.current && scaler > minFlowRef.current) {
            if (monochromeRef.current === true) {
              context.strokeStyle = "#FF6347";
            } else {
              context.strokeStyle = getDirectionalColor(u, v);
            }

            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x - u, y + v);
            context.stroke();
          }

          if (histogramRef.current === true) {
            const index = +(
              (canvas.width / (maxFlowRef.current - minFlowRef.current)) *
                scaler -
              canvas.width / (maxFlowRef.current - minFlowRef.current)
            ).toFixed(0);
            scalers[index] = scalers[index] + 1;
            // draw histogram
            context.strokeStyle = "#FF6347";
            context.beginPath();
            context.moveTo(index, canvas.height);
            context.lineTo(index, canvas.height - scalers[index]);
            context.stroke();
          }
        }
        setData(scalers);
        gpu.destroy();

        kernel.destroy();
      }
      lastPixels.current = pixels;

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
  }, [
    video,
    canvas,
    size,
    quality,
    minFlow,
    maxFlow,
    transparency,
    monochrome,
    histogram,
  ]);

  // useEffect(() => {
  //   if (!data || hasPrinted) return;
  //   // histogram values
  //   console.log(data);
  //   setHasPrinted(true);
  // }, [data, hasPrinted]);

  useEffect(() => {
    const render = (current: number) => {
      if (!chartRef.current) return;
      chartTimestamp.current = current;
      const canvas = chartRef.current;
      canvas.width = size.width;
      canvas.height = size.height;
      if (!data) return;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.strokeStyle = "#FF6347";
      context.beginPath();
      let index = 0;
      for (let count of data) {
        context.moveTo(index, canvas.height);
        context.lineTo(index, canvas.height - count);
        context.stroke();
        index++;
      }
    };
    requestAnimationFrame(render);
    return () => cancelAnimationFrame(chartTimestamp.current);
  }, [data]);

  return (
    <div className="w-screen mt-10 flex flex-col items-center justify-center">
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
      <div>
        <canvas ref={chartRef} />
      </div>
      <div className="m-4">Flow Points {zonesLength}</div>
      <div className="flex">
        <Controls
          quality={quality}
          maxFlow={maxFlow}
          minFlow={minFlow}
          transparency={transparency}
          monochrome={monochrome}
          histogram={histogram}
          handleQuality={handleQuality}
          handleMaxFlow={handleMaxFlow}
          handleMinFlow={handleMinFlow}
          handleTransparency={handleTransparency}
          handleMonochrome={handleMonochrome}
          handleHistogram={handleHistogram}
        />
        <Legend />
      </div>
    </div>
  );
}

export default App;
