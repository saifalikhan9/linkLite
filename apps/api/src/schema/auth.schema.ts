import { z } from "zod";

export const authSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password cannot exceed 16 characters"),

  email: z
    .email("Invalid email address"),
});