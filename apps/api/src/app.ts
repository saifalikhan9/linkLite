import express from "express";
import healthRouter from "./routes/health.route";
import authRouter from "./routes/auth.route";
import { errorHandler } from "./errors/error-handlers";
import { notFound } from "./middlewares/not-found";

const app = express();

app.use(express.json());

app.use("/health", healthRouter);
app.use("/auth", authRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
