import { useEffect, useState } from "react";

export const useGetViewport = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });
  return { width, height };
};

const fromArgb = (a: number, r: number, g: number, b: number) => {
  return "rgba(" + [r, g, b, a / 255].join(",") + ")";
};

const convertHsvToRgb = (h: number, s: number, v: number) => {
  var a, b, c, d, hueFloor;
  h = h / 360;
  if (s > 0) {
    if (h >= 1) {
      h = 0;
    }
    h = 6 * h;
    hueFloor = Math.floor(h);
    a = Math.round(255 * v * (1.0 - s));
    b = Math.round(255 * v * (1.0 - s * (h - hueFloor)));
    c = Math.round(255 * v * (1.0 - s * (1.0 - (h - hueFloor))));
    d = Math.round(255 * v);

    switch (hueFloor) {
      case 0:
        return fromArgb(255, d, c, a);
      case 1:
        return fromArgb(255, b, d, a);
      case 2:
        return fromArgb(255, a, d, c);
      case 3:
        return fromArgb(255, a, b, d);
      case 4:
        return fromArgb(255, c, a, d);
      case 5:
        return fromArgb(255, d, a, b);
      default:
        return fromArgb(0, 0, 0, 255);
    }
  }
  d = v * 255;
  return fromArgb(255, d, d, d);
};

export const getDirectionalColor = (x: number, y: number) => {
  const toDegree = 180 / Math.PI;
  const hue = (Math.atan2(y, x) * toDegree + 360) % 360;
  return convertHsvToRgb(hue, 1, 1);
};
