import { Request, Response } from "express";
import { healthService } from "../services/health.services";

export const healthController = async (
  _req: Request,
  res: Response
) => {
  const health = await healthService();

  res.status(200).json({
    success: true,
    data: health,
  });
};