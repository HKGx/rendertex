import { TeX } from "mathjax-full/js/input/tex.js";
import TexError from "mathjax-full/js/input/tex/TexError.js";

interface ErroringInput {
  formatError(err: TexError): never;
}

class ErroringTex
  extends TeX<unknown, unknown, unknown>
  implements ErroringInput
{
  override formatError(err: TexError): never {
    throw err;
  }
}

export { ErroringTex, TexError, ErroringInput };
