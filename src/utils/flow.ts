export const kernelFunction = `function (lastPixels, pixels, zones, quality, width) {
    const x = zones[this.thread.x][0];
    const y = zones[this.thread.x][1];
    let A2 = 0;
    let A1B2 = 0;
    let B1 = 0;
    let C1 = 0;
    let C2 = 0;
    let u = 0;
    let v = 0;
    for (let localY = -quality; localY <= quality; localY++) {
      for (let localX = -quality; localX <= quality; localX++) {
        const address = (y + localY) * width + x + localX;
        const gradX =
          pixels[(address - 1) * 4] - pixels[(address + 1) * 4];
        const gradY =
          pixels[(address - width) * 4] -
          pixels[(address + width) * 4];
        const gradT = lastPixels[address * 4] - pixels[address * 4];
        A2 += gradX * gradX;
        A1B2 += gradX * gradY;
        B1 += gradY * gradY;
        C2 += gradX * gradT;
        C1 += gradY * gradT;
      }
    }
    const delta = A1B2 * A1B2 - A2 * B1;
    if (delta !== 0) {
      /* system is not singular - solving by Kramer method */
      const iDelta = quality / delta;
      const deltaX = -(C1 * A1B2 - C2 * B1);
      const deltaY = -(A1B2 * C2 - A2 * C1);
      u = deltaX * iDelta;
      v = deltaY * iDelta;
    } else {
      /* singular system - find optical flow in gradient direction */
      const norm =
        (A1B2 + A2) * (A1B2 + A2) + (B1 + A1B2) * (B1 + A1B2);
      if (norm !== 0) {
        const iGradNorm = quality / norm;
        const temp = -(C1 + C2) * iGradNorm;
        u = (A1B2 + A2) * temp;
        v = (B1 + A1B2) * temp;
      }
    }
    if (-quality > u && u > quality && -quality > v && v > quality) {
      u = 10;
      v = 10;
    }
    return [x, y, u, v];
  }`;

export const generateZones = (
  width: number,
  height: number,
  quality: number
) => {
  let zones = [];
  for (let y = 0; y < height; y += quality) {
    for (let x = 0; x < width; x += quality) {
      const array = new Float32Array(4);
      array[0] = x;
      array[1] = y;
      array[2] = 1;
      array[3] = 1;
      zones.push(array);
    }
  }
  return zones;
};
