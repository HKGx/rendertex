import { SVG } from "mathjax-full/js/output/svg.js";
import { ErroringTex } from "./ErroringTex.js";
import { create, generate } from "./latexService.js";

const tex = new ErroringTex();
const svg = new SVG();

const document = create(tex, svg);

const latexToSvg = generate(document);

export default latexToSvg;
