import sharp from "sharp";
import type { SvgToSharpOptions } from "../types/SvgToSharpOptions.js";

const resize =
  ({ alpha, flatten }: { alpha: number; flatten: boolean }) =>
  (image: sharp.Sharp, options?: SvgToSharpOptions): sharp.Sharp => {
    const { padding = 16, scale = 1 } = options || {};
    const flat = flatten ? { background: "#FFFFFF" } : false;

    return image.flatten(flat).extend({
      top: padding * scale,
      left: padding * scale,
      bottom: padding * scale,
      right: padding * scale,
      background: { alpha, r: 255, g: 255, b: 255 },
    });
  };

const jpegResize = resize({
  alpha: 1, // Opaque background
  flatten: true,
});
const pngResize = resize({
  alpha: 0, // Transparent background
  flatten: false,
});

function svgToSharp(svg: string, options?: SvgToSharpOptions): sharp.Sharp {
  const { scale = 1 } = options || {};

  return sharp(Buffer.from(svg), { density: 144 * scale });
}

export { svgToSharp, jpegResize, pngResize };
