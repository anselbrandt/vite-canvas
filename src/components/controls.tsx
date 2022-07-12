import { ChangeEventHandler, FC, MouseEventHandler } from "react";

interface ControlsProps {
  quality: number;
  maxFlow: number;
  minFlow: number;
  transparency: number;
  monochrome: boolean;
  histogram: boolean;
  handleQuality: ChangeEventHandler<HTMLInputElement>;
  handleMaxFlow: ChangeEventHandler<HTMLInputElement>;
  handleMinFlow: ChangeEventHandler<HTMLInputElement>;
  handleTransparency: ChangeEventHandler<HTMLInputElement>;
  handleMonochrome: MouseEventHandler<HTMLButtonElement>;
  handleHistogram: MouseEventHandler<HTMLButtonElement>;
}

const Controls: FC<ControlsProps> = ({
  quality,
  maxFlow,
  minFlow,
  transparency,
  monochrome,
  histogram,
  handleQuality,
  handleMaxFlow,
  handleMinFlow,
  handleTransparency,
  handleMonochrome,
  handleHistogram,
}) => {
  return (
    <div className="m-4">
      <div>
        Flow Grid Size
        <input
          type="range"
          min={2}
          max={100}
          value={quality}
          onChange={handleQuality}
        ></input>
        {quality}
      </div>
      <div>
        Max Flow
        <input
          type="range"
          min={10}
          max={2000}
          value={maxFlow}
          onChange={handleMaxFlow}
        ></input>
        {maxFlow}
      </div>
      <div>
        Min Flow
        <input
          type="range"
          min={1}
          max={100}
          value={minFlow}
          onChange={handleMinFlow}
        ></input>
        {minFlow}
      </div>
      <div>
        Transparency
        <input
          type="range"
          min={0}
          max={100}
          value={transparency * 100}
          onChange={handleTransparency}
        ></input>
        {transparency}
      </div>
      <div>
        <div className="m-2 p-2 bg-sky-600 hover:bg-sky-700 hover:cursor-pointer text-white text-center rounded-lg">
          <button onClick={handleMonochrome}>
            {monochrome ? "Multicolor" : "Monochrome"}
          </button>
        </div>
        <div className="m-2 p-2 bg-sky-600 hover:bg-sky-700 hover:cursor-pointer text-white text-center rounded-lg">
          <button onClick={handleHistogram}>
            {histogram ? "No Histogram" : "Histogram"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
