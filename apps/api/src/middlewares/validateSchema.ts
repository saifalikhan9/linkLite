import { AppError } from "../errors/app-errors";
import { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export const validateSchema = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.length ? issue.path.join(".") : "body",
        message: issue.message,
      }));
      return next(new AppError(`Validation Error`, 400, errors));
    }
    req.body = result.data;
    next();
  };
};
