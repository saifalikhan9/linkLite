import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import healthRouter from "./routes/health.route";
import authRouter from "./routes/auth.route";
import urlRouter from "./routes/url.route";
import redirectRouter from "./routes/redirect.router";

import { errorHandler } from "./errors/error-handlers";
import { notFound } from "./middlewares/not-found";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/urls", urlRouter);
app.use("/r", redirectRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
