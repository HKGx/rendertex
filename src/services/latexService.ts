import type { LiteElement } from "mathjax-full/js/adaptors/lite/Element";
import type { AbstractInputJax } from "mathjax-full/js/core/InputJax";
import type { MathDocument } from "mathjax-full/js/core/MathDocument";
import type { CommonOutputJax } from "mathjax-full/js/output/common/OutputJax";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor.js";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html.js";
import { mathjax } from "mathjax-full/js/mathjax.js";

import type { ErroringInput } from "./ErroringTex.js";

function create<
  T extends AbstractInputJax<unknown, unknown, unknown> & ErroringInput
>(
  input: T,
  output: CommonOutputJax<unknown, unknown, unknown, any, any, any, any>
): MathDocument<any, any, any> {
  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);
  const document = mathjax.document("", { InputJax: input, OutputJax: output });
  return document;
}

type Success = [string, undefined];
type Error = [undefined, string];

function isError(t: [unknown, unknown]): t is Error {
  const [_, err] = t;
  return err !== undefined && typeof err === "string";
}

export const generate =
  (doc: MathDocument<any, any, any>) =>
  (data: string): Success | Error => {
    try {
      const node: LiteElement = doc.convert(data);
      const html = doc.adaptor.innerHTML(node);
      return [html, undefined];
    } catch (err) {
      if (err instanceof Error) {
        return [undefined, err.message];
      }
      throw err;
    }
  };

export { create, isError };
