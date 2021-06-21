import canvas from "canvas";
import { SvgToCanvasOptions } from "../types/SvgToCanvasOptions.js";

const { createCanvas, loadImage } = canvas;

async function svgToCanvas(
  svg: Buffer,
  options?: SvgToCanvasOptions
): Promise<canvas.Canvas> {
  const { padding = 16, scale = 1, transparent = false } = options || {};
  const image = await loadImage(svg);

  image.width *= scale;
  image.height *= scale;

  const canvas = createCanvas(
    image.width + 2 * padding,
    image.height + 2 * padding
  );

  const ctx = canvas.getContext("2d");
  if (!transparent) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(image, padding, padding);

  return canvas;
}

export { svgToCanvas };
