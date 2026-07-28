import { Request, Response } from "express";
import {
  deleteUrlService,
  editUrlService,
  getUserUrlsService,
  redirectUrlService,
  urlShortnerService,
} from "../services/urls.services";
import { AppError } from "../errors/app-errors";

export const shortURL = async (req: Request, res: Response) => {
  const data = await urlShortnerService({
    originalUrl: req.body.originalUrl,
    userId: req.user?.id!,
  });

  return res.status(201).json({
    status: true,
    data,
  });
};

export const redirectUrlController = async (req: Request, res: Response) => {
  const { shortCode } = req.params as { shortCode: string };
  if (!shortCode) {
    throw new AppError("please enter correct url", 400);
  }

  const originalUrl = await redirectUrlService({
    shortCode,
  });

  return res.redirect(originalUrl);
};

export const getUserUrlsController = async (req: Request, res: Response) => {
  const data = await getUserUrlsService({ userId: req.user?.id! });

  return res.status(200).json({
    success: true,
    data,
  });
};

export const editUrlController = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.id!;

  if (!id) {
    throw new AppError("Bad Request", 400);
  }
  const originalUrl = req.body?.originalUrl as string | undefined;
  const expiresAt = req.body?.expiresAt as string | undefined;

  if (!originalUrl && !expiresAt) {
    throw new AppError("please provide either originalUrl or expiresAt", 400);
  }

  const result = await editUrlService({ originalUrl, expiresAt, userId, id });

  return res.status(200).json({
    success: true,
    data: result,
  });
};

export const deleteUrlController = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.id!;

  if (!id) {
    throw new AppError("Bad Request", 400);
  }

  await deleteUrlService({ id, userId });

  return res.sendStatus(204);
};
