import { z } from "zod";

export const urlSchema = z.object({
  originalUrl: z.string("Please provide the url").min(1),
});
