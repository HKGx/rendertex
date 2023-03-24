import { makeApi } from "@zodios/core";
import { zodiosRouter } from "@zodios/express";
import { z } from "zod";

import { getImage, setImage } from "../../cache.js";
import latexToSvg from "../../services/latexToSvg.js";
import { jpegResize, svgToSharp } from "../../services/svgToCanvas.js";
import { isError } from "../../services/latexService.js";

const api = makeApi([
  {
    method: "get",
    path: "/latex/jpg/:data",
    parameters: [
      {
        name: "data",
        type: "Path",
        schema: z.string().min(0).max(1024),
      },
    ],
    response: z.instanceof(Buffer),
  },
]);

const router = zodiosRouter(api);

router.get("/latex/jpg/:data", async (req, res) => {
  res.header("Cache-Control", "public, max-age=604800, immutable");

  const jpg = await getImage(req.url);
  if (jpg) {
    res.header("Content-Type", "image/jpg");
    res.send(jpg);
    return;
  }

  const { data } = req.params;
  const svgResult = latexToSvg(data);

  if (isError(svgResult)) {
    res.sendStatus(500).send({ error: svgResult[1] } as unknown as Buffer);
    return;
  }
  const [svg] = svgResult;

  const sharp = svgToSharp(svg, req.query);
  const resized = jpegResize(sharp, req.query);
  const buffer = await resized.jpeg().toBuffer();

  res.header("Content-Type", "image/jpg");
  await setImage(req.url, buffer);

  res.send(buffer);
});

export default router;
