import express from "express";
import cookieParser  from "cookie-parser"

import healthRouter from "./routes/health.route";
import authRouter from "./routes/auth.route";
import urlRouter from "./routes/url.route";
import redirectRouter from "./routes/redirect.router";

import { errorHandler } from "./errors/error-handlers";
import { notFound } from "./middlewares/not-found";


const app = express();

app.use(express.json());
app.use(cookieParser())

app.use("/health", healthRouter);
app.use("/auth", authRouter);
app.use("/urls", urlRouter);
app.use("/", redirectRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
