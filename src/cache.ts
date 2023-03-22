import { commandOptions, createClient } from "redis";
import env from "./env.js";
import { createHash } from "crypto";

const client = createClient({
  url: env.REDIS,
});

await client.connect();

const CACHE_TIME = 24 * 60 * 60; // 24 hours * 60 minutes * 60 seconds

export const getImage = (url: string) =>
  client.getEx(commandOptions({ returnBuffers: true }), url, {
    EX: CACHE_TIME,
  });

export const setImage = (url: string, imageBuffer: Buffer) =>
  client.setEx(url, CACHE_TIME, imageBuffer);
