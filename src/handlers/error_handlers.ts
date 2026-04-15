import { Response } from "express";

export function errorHandler(code: number, message: string, res: Response) {
  res.header("Content-Type", "application/json");
  const errorMessage = JSON.stringify({
    error: message
  }) 
  res.status(code).send(errorMessage)
}