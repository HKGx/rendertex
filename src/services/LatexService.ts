import { LiteElement } from "mathjax-full/js/adaptors/lite/Element.js";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor.js";
import { AbstractInputJax } from "mathjax-full/js/core/InputJax.js";
import { MathDocument } from "mathjax-full/js/core/MathDocument.js";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html.js";
import { mathjax } from "mathjax-full/js/mathjax.js";
import { CommonOutputJax } from "mathjax-full/js/output/common/OutputJax.js";
import { ErroringInput } from "./ErroringInput.js";

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

type Success = [Buffer, undefined];
type Error = [undefined, string];

function isGenerateError(t: [unknown, unknown]): t is Error {
  return !!t[1];
}

function generate(doc: MathDocument<any, any, any>) {
  function inner(data: string): Success | Error {
    try {
      const node: LiteElement = doc.convert(data);
      const html = doc.adaptor.innerHTML(node);
      return [Buffer.from(html), undefined];
    } catch (err) {
      const message = err.message;
      if (message && typeof message === "string") {
        return [undefined, message];
      }
      throw err;
    }
  }
  return inner;
}

export { create, generate, isGenerateError };
