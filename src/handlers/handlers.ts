import { Request, Response } from "express"
import { config } from "../config.js"

export async function handlerReadiness(req: Request, res: Response): Promise<void> {
  res.set('Content-Type', 'text/plain')
  res.send("OK")
}

export async function handlerRequestHits(req: Request, res: Response): Promise<void> {
  res.set('Content-Type', 'text/html')
  res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`)
}

export async function handlerResetRequestHits(req: Request, res: Response): Promise<void> {
  config.fileserverHits = 0
  res.set('Content-Type', 'text/plain')
  res.send(`OK`)
}