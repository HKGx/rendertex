import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config({
  path: process.env["NODE_ENV"] === "development" ? ".env.local" : ".env",
});

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.string().optional().default("3000"),
  REDIS: z.string(),
});

export default envSchema.parse(process.env);
