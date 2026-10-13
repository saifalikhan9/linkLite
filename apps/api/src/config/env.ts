
import "dotenv/config";
import { z } from "zod";
import { logger } from "../bootstrap/logger";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().int().min(1).max(65535).default(4000),

  JWT_ACCESS_TOKEN_SECRET_KEY: z
    .string()
    .min(1, "JWT_ACCESS_TOKEN_SECRET_KEY is required"),

  JWT_REFRESH_TOKEN_SECRET_KEY: z
    .string()
    .min(1, "JWT_REFRESH_TOKEN_SECRET_KEY is required"),

  BASE62_SECRET_KEY: z
    .string()
    .min(1, "BASE62_SECRET_KEY is required"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  logger.error("Environment validation failed", {
    errors: result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  });

  process.exit(1);
}

export const env = Object.freeze(result.data);
