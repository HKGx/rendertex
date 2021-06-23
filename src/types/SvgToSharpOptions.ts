// interface SvgToCanvasOptions {
//     scale: number;
//     padding: number;
//     transparent: boolean;
//   }
import { Static, Type } from "@sinclair/typebox";

const SvgToSharpOptions = Type.Object({
  scale: Type.Integer({ minimum: 1, maximum: 10, default: 1 }),
  padding: Type.Integer({ minimum: 0, maximum: 64, default: 16 })
});

type SvgToSharpOptions = Static<typeof SvgToSharpOptions>;

export { SvgToSharpOptions };
