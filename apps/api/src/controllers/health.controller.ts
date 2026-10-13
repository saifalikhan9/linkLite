import { Request, Response } from "express";
import { healthService } from "../services/health.services";

export const healthController = async (_req: Request, res: Response) => {
  const health = await healthService();

  if (health.database === "down") {

    return res.status(503).json({
      success: true,
      data: health,
    });
    
  }

  res.status(200).json({
    success: true,
    data: health,
  });
};
