import fastify from "fastify";

import NodeCache from "node-cache";

import { isGenerateError } from "./services/LatexService.js";
import { latexToSvg } from "./services/LatexToSvg.js";
import { jpegResize, pngResize, svgToSharp } from "./services/SvgToCanvas.js";
import { CommonRequest } from "./types/CommonRequest.js";
import { LatexRequest } from "./types/LatexRequest.js";
import { SvgToSharpOptions } from "./types/SvgToSharpOptions.js";

const cache = new NodeCache({
  stdTTL: 36000,
  checkperiod: 360,
});

const server = fastify({
  maxParamLength: CommonRequest.properties.data.maxLength,
  logger: true,
});

const getSvgResult = (
  data: string,
  nodeCache: NodeCache
): ReturnType<typeof latexToSvg> => {
  let svgResult = nodeCache.get("svg" + data) as
    | ReturnType<typeof latexToSvg>
    | undefined;
  if (!svgResult) {
    svgResult = latexToSvg(data);
    cache.set("svg" + data, svgResult);
  }
  return svgResult;
};

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

    const svgResult = getSvgResult(data, cache);

    if (isGenerateError(svgResult)) {
      return { error: svgResult[1] };
    }
    const [svg] = svgResult;
    rep.header("Content-Type", "image/svg+xml");
    cache.set(req.url, svg);
    return svg;
  }
);

server.get<{ Params: LatexRequest; Querystring: SvgToSharpOptions }>(
  "/latex/png/:data",
  {
    schema: {
      params: LatexRequest,
      querystring: SvgToSharpOptions,
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

    const svgResult = getSvgResult(data, cache);

    if (isGenerateError(svgResult)) {
      return { error: svgResult[1] };
    }
    const [svg] = svgResult;

    const sharp = await svgToSharp(svg, req.query);
    const resized = pngResize(sharp, req.query);
    const buffer = await resized.png().toBuffer();

    rep.header("Content-Type", "image/png");
    cache.set(req.url, buffer);
    return buffer;
  }
);

server.get<{ Params: LatexRequest; Querystring: SvgToSharpOptions }>(
  "/latex/jpg/:data",
  {
    schema: {
      params: LatexRequest,
      querystring: SvgToSharpOptions,
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

    const svgResult = getSvgResult(data, cache);

    if (isGenerateError(svgResult)) {
      return { error: svgResult[1] };
    }
    const [svg] = svgResult;

    const sharp = await svgToSharp(svg, req.query);
    const resized = jpegResize(sharp, req.query);
    const buffer = await resized.jpeg().toBuffer();

    rep.header("Content-Type", "image/jpg");
    cache.set(req.url, buffer);
    return buffer;
  }
);

server.addHook("onResponse", (req, rep) => {
  if (req.url.length < 1024) {
    const decoded = decodeURIComponent(req.url);
    const pathLength = (req.routerPath || "").length;
    const maxLength = 20;
    const ellipsis = "...";
    if (decoded.length > pathLength + maxLength) {
      const trimmed =
        decoded.slice(0, pathLength + maxLength - ellipsis.length) + ellipsis;
      server.log.info(
        `Request at \`${trimmed}\` took ${rep.getResponseTime().toFixed(2)} ms`
      );
    } else {
      server.log.info(
        `Request at \`${decoded}\` took \`${rep
          .getResponseTime()
          .toFixed(2)}ms\``
      );
    }
  }
});

await server.listen({ port: 8080 });
