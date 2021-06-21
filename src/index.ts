import fastify from "fastify";

import NodeCache from "node-cache";
import { Readable } from "stream";

import { isGenerateError } from "./services/LatexService.js";
import { latexToSvg } from "./services/LatexToSvg.js";
import { svgToCanvas } from "./services/SvgToCanvas.js";
import { CommonRequest } from "./types/CommonRequest.js";
import { LatexRequest } from "./types/LatexRequest.js";
import { SvgToCanvasOptions } from "./types/SvgToCanvasOptions.js";

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

const cache = new NodeCache({
  stdTTL: 36000,
  checkperiod: 360,
});

const server = fastify({
  maxParamLength: CommonRequest.properties.data.maxLength,
});

server.get<{ Params: LatexRequest }>(
  "/latex/svg/:data",
  {
    schema: {
      params: LatexRequest,
    },
  },
  async (req, rep) => {
    rep.header("Cache-Control", "public, max-age=600");

    const { data } = req.params;

    let svgResult = cache.get("svg" + data) as
      | ReturnType<typeof latexToSvg>
      | undefined;
    if (!svgResult) {
      svgResult = latexToSvg(data);
      cache.set("svg" + data, svgResult);
    }

    if (isGenerateError(svgResult)) {
      return { error: svgResult[1] };
    }
    const [svg] = svgResult;
    rep.header("Content-Type", "image/svg+xml");
    cache.set(req.url, svg);
    return svg;
  }
);

server.get<{ Params: LatexRequest; Querystring: SvgToCanvasOptions }>(
  "/latex/png/:data",
  {
    schema: {
      params: LatexRequest,
      querystring: SvgToCanvasOptions,
    },
  },
  async (req, rep) => {
    rep.header("Cache-Control", "public, max-age=604800, immutable");

    const png = cache.get(req.url) as Buffer | undefined;
    if (png) {
      rep.header("Content-Type", "image/png");
      return png;
    }

    const { data } = req.params;

    let svgResult = cache.get(req.url) as
      | ReturnType<typeof latexToSvg>
      | undefined;
    if (!svgResult) {
      svgResult = latexToSvg(data);
      cache.set(req.url, svgResult);
    }
    if (isGenerateError(svgResult)) {
      return { error: svgResult[1] };
    }
    const [svg] = svgResult;

    const canvas = await svgToCanvas(svg, req.query);

    rep.header("Content-Type", "image/png");
    const buffer = await streamToBuffer(canvas.createPNGStream());
    cache.set(req.url, buffer);
    return buffer;
  }
);

server.get<{ Params: LatexRequest; Querystring: SvgToCanvasOptions }>(
  "/latex/jpg/:data",
  {
    schema: {
      params: LatexRequest,
      querystring: SvgToCanvasOptions,
    },
  },
  async (req, rep) => {
    rep.header("Cache-Control", "public, max-age=604800, immutable");

    const jpg = cache.get(req.url) as Buffer | undefined;
    if (jpg) {
      rep.header("Content-Type", "image/jpg");
      return jpg;
    }

    const { data } = req.params;

    let svgResult = cache.get(req.url) as
      | ReturnType<typeof latexToSvg>
      | undefined;
    if (!svgResult) {
      svgResult = latexToSvg(data);
      cache.set(req.url, svgResult);
    }

    if (isGenerateError(svgResult)) {
      return { error: svgResult[1] };
    }
    const [svg] = svgResult;

    const canvas = await svgToCanvas(svg, req.query);

    rep.header("Content-Type", "image/jpg");
    const buffer = await streamToBuffer(canvas.createPNGStream());
    cache.set(req.url, buffer);
    return buffer;
  }
);

server.addHook("onResponse", (req, rep) => {
  console.log();
  if (req.url.length < 1024) {
    const decoded = decodeURIComponent(req.url);
    const trimmed =
      decoded.length > req.routerPath.length + 20
        ? decoded.slice(0, req.routerPath.length + 17) + "..."
        : decoded;
    console.log(
      `Request at \`${trimmed}\` took ${rep.getResponseTime().toFixed(2)} ms`
    );
  }
});

const address = await server.listen({ port: 8080 });

console.log(`Listening over ${address.replace("[::]", "localhost")}`);
