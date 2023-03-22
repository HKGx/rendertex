import z from "zod";

const CommonRequest = z.object({
  data: z.string().min(1).max(1024),
});

type CommonRequest = z.infer<typeof CommonRequest>;

export { CommonRequest };
