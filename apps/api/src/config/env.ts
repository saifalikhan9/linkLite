import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().positive().default(4000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  DATABASE_URL: z.string().min(1),

  JWT_ACCESS_TOKEN_SECRET_KEY: z.string("please provide the access secret key"),

  JWT_REFRESH_TOKEN_SECRET_KEY: z.string(
    "please provide the refresh secret key",
  ),
  BASE62_SECRET_KEY: z.string("please provide the base62 secret key"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(parsedEnv.error.message);

  process.exit(1);
}

export const ENV = parsedEnv.data;
