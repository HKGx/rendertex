import { makeApi } from "@zodios/core";
import { zodiosRouter } from "@zodios/express";
import { z } from "zod";

const localFile = <T extends string>(
  path: T
): {
  method: "get";
  path: T;
  response: z.ZodNever;
} => ({
  method: "get",
  path,
  response: z.never(),
});

const api = makeApi([
  localFile("/"),
  localFile("/style.css"),
  localFile("/index.js"),
]);

const router = zodiosRouter(api);

router.get("/", (_, res) => {
  res.sendFile("index.html", { root: "./public" });
});

router.get("/style.css", (_, res) => {
  res.sendFile("style.css", { root: "./public" });
});

router.get("/index.js", (_, res) => {
  res.sendFile("index.js", { root: "./public" });
});

export default router;
