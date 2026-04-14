import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
  res.on('finish', () => {
    if (res.statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`)
    }
  })
  next()
}

export function middlewareCountRequest(req: Request, res: Response, next: NextFunction) {
  config.fileserverHits += 1
  next()
}