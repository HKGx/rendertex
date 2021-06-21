import { SVG } from "mathjax-full/js/output/svg.js";
import { ErroringTex } from "./ErroringInput.js";
import { create, generate } from "./LatexService.js";

const tex = new ErroringTex();
const svg = new SVG();

const document = create(tex, svg);

const latexToSvg = generate(document);

export { latexToSvg };
