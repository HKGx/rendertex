// import { caching, MemoryCache } from "cache-manager";
import "./env.js";
import "./cache.js";
import app from "./app.js";

// import { isGenerateError } from "./services/LatexService.js";
// import latexToSvg from "./services/LatexToSvg.js";
// import { jpegResize, pngResize, svgToSharp } from "./services/SvgToCanvas.js";
// import { CommonRequest } from "./types/CommonRequest.js";

// const cache = await caching("memory", {
//   ttl: 60 * 60 * 1000, // milliseconds to 1 hour
// });

// const server = fastify({
//   maxParamLength: CommonRequest.shape.data.maxLength ?? 100, // 100 is the default for fastify
//   logger: true,
// }).withTypeProvider<ZodTypeProvider>();

// import autoroutes from "fastify-autoroutes";

// server.setValidatorCompiler(validatorCompiler);
// server.setSerializerCompiler(serializerCompiler);

// server.register(autoroutes, {
//   dir: "./routes",
// });

// // server.get<{ Params: LatexRequest }>(
// //   "/latex/svg/:data",
// //   {
// //     schema: {
// //       params: LatexRequest,
// //     },
// //   },
// //   async (req, rep) => {
// //     rep.header("Cache-Control", "public, max-age=600");

// //     const { data } = req.params;

// //     const svgResult = await getSvgResult(data, cache);

// //     if (isGenerateError(svgResult)) {
// //       return { error: svgResult[1] };
// //     }
// //     const [svg] = svgResult;
// //     rep.header("Content-Type", "image/svg+xml");
// //     cache.set(req.url, svg);
// //     return svg;
// //   }
// // );

// // server.get<{ Params: LatexRequest; Querystring: SvgToSharpOptions }>(
// //   "/latex/png/:data",
// //   {
// //     schema: {
// //       params: LatexRequest,
// //       querystring: SvgToSharpOptions,
// //     },
// //   },
// //   async (req, rep) => {
// //     rep.header("Cache-Control", "public, max-age=604800, immutable");

// //     const png = await cache.get<Buffer>(req.url);
// //     if (png) {
// //       rep.header("Content-Type", "image/png");
// //       return png;
// //     }

// //     const { data } = req.params;

// //     const svgResult = await getSvgResult(data, cache);

// //     if (isGenerateError(svgResult)) {
// //       return { error: svgResult[1] };
// //     }
// //     const [svg] = svgResult;

// //     const sharp = await svgToSharp(svg, req.query);
// //     const resized = pngResize(sharp)(req.query);
// //     const buffer = await resized.png().toBuffer();

// //     rep.header("Content-Type", "image/png");
// //     cache.set(req.url, buffer);
// //     return buffer;
// //   }
// // );

// // server.get<{ Params: LatexRequest; Querystring: SvgToSharpOptions }>(
// //   "/latex/jpg/:data",
// //   {
// //     schema: {
// //       params: LatexRequest,
// //       querystring: SvgToSharpOptions,
// //     },
// //   },
// //   async (req, rep) => {
// //     rep.header("Cache-Control", "public, max-age=604800, immutable");

// //     const jpg = await cache.get<Buffer>(req.url);
// //     if (jpg) {
// //       rep.header("Content-Type", "image/jpg");
// //       return jpg;
// //     }

// //     const { data } = req.params;

// //     const svgResult = await getSvgResult(data, cache);

// //     if (isGenerateError(svgResult)) {
// //       return { error: svgResult[1] };
// //     }
// //     const [svg] = svgResult;

// //     const sharp = await svgToSharp(svg, req.query);
// //     const resized = jpegResize(sharp)(req.query);
// //     const buffer = await resized.jpeg().toBuffer();

// //     rep.header("Content-Type", "image/jpg");
// //     cache.set(req.url, buffer);
// //     return buffer;
// //   }
// // );

// server.addHook("onResponse", (req, rep) => {
//   if (req.url.length < 1024) {
//     const decoded = decodeURIComponent(req.url);
//     const pathLength = (req.routerPath || "").length;
//     const maxLength = 20;
//     const ellipsis = "...";
//     if (decoded.length > pathLength + maxLength) {
//       const trimmed =
//         decoded.slice(0, pathLength + maxLength - ellipsis.length) + ellipsis;
//       server.log.info(
//         `Request at \`${trimmed}\` took ${rep.getResponseTime().toFixed(2)} ms`
//       );
//     } else {
//       server.log.info(
//         `Request at \`${decoded}\` took \`${rep
//           .getResponseTime()
//           .toFixed(2)}ms\``
//       );
//     }
//   }
// });

const port = 8080;

app.listen({ port }, () =>
  console.log(`🔥 Server started at http://localhost:${port} `)
);
