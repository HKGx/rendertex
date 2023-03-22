import z from "zod";

const SvgToSharpOptions = z.object({
  scale: z.number().int().min(1).max(10).default(1),
  padding: z.number().int().min(0).max(64).default(16),
});

type SvgToSharpOptions = z.infer<typeof SvgToSharpOptions>;

export { SvgToSharpOptions };
