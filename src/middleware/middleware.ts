import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { respondWithError } from "../api/handlers/response_json.js";
import { BadRequest, NotFound, Unauthorized, Forbidden } from "../api/error_classes.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
  res.on('finish', () => {
    if (res.statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`)
    }
  })
  next()
}

export function middlewareCountRequest(req: Request, res: Response, next: NextFunction) {
  config.api.fileServerHits += 1
  next()
}

export function errorHandler(err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500
  let message = "Something went wrong on our end";
  switch (err.constructor) {
    case BadRequest:
      statusCode = 400
      message = err.message
      break
    case Unauthorized:
      statusCode = 401
      message = err.message
      break
    case Forbidden:
      statusCode = 403
      message = err.message
      break
    case NotFound:
      statusCode = 404
      message = err.message
      break
  }
  
  if (statusCode >= 500) {
    console.log(err.message)
  }

  respondWithError(statusCode, message, res)
}