import sharp from "sharp";
import { SvgToSharpOptions } from "../types/SvgToSharpOptions.js";


function resize(alpha: number, flatten?: boolean) {
  return function(image: sharp.Sharp, options?: SvgToSharpOptions) : sharp.Sharp {
    const { padding = 16, scale = 1} = options || {};
    const flat = flatten ? {background: "#FFFFFF"} : false;
    return image.flatten(flat).extend({
      top: padding * scale,
      left: padding * scale,
      bottom: padding * scale,
      right: padding * scale,
      background: { alpha, r: 255, g: 255, b: 255 },
    })
  }

}

const jpegResize = resize(1, true);
const pngResize = resize(0);

async function svgToSharp(
  svg: Buffer,
  options?: SvgToSharpOptions
): Promise<sharp.Sharp> {
  const {scale = 1 } = options || {};

  const image = sharp(svg, { density: 72 * scale });
  return image;
}

export { svgToSharp, jpegResize, pngResize  };
