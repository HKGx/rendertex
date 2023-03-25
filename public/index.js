import { h, render } from "https://esm.sh/preact";
import {} from "https://unpkg.com/mathlive?module";
import { useState, useEffect, useRef } from "https://esm.sh/preact/hooks.js";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const MathField = ({ setValue }) => {
  const ref = useRef(null);

  useEffect(() => {
    const mathField = ref.current;
    mathField.addEventListener("input", (e) => {
      setValue(e.target.value);
    });
  }, []);

  return h("math-field", {
    ref,
  });
};

const RenderedMath = ({ value }) => {
  const url = `/latex/jpg/${encodeURIComponent(value)}?scale=5`;
  return h("img", { src: url, class: "rendered" });
};

const Box = () => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 1000);

  const span = h("span", {}, debouncedValue);
  const input = h(MathField, { setValue });
  const renderedMath = h(RenderedMath, { value: debouncedValue });
  return h("div", { class: "box" }, input, span, renderedMath);
};

const App = () => {
  return h(Box);
};

render(h(App), document.body);
