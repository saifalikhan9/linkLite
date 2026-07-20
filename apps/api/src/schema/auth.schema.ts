import { z } from "zod";

export const createUserSchema = z.object({
  userName: z
    .string()
    .min(5, "Username must be at least 5 characters")
    .max(10, "Username cannot exceed 10 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password cannot exceed 16 characters"),

  email: z
    .email("Invalid email address"),
});