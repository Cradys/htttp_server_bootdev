import { NextFunction, Request, Response } from "express"
import { NotFound, BadRequest, Forbidden } from "../error_classes.js"
import { config } from "../../config.js"
import { deleteUsers } from "../../db/queries/users.js"
import { deleteChirps } from "../../db/queries/chirps.js"
import { deleteRefreshToken } from "../../db/queries/refreshTokens.js"


export async function handlerReadiness(req: Request, res: Response): Promise<void> {
  res.set('Content-Type', 'text/plain')
  res.send("OK")
}


export async function handlerRequestHits(req: Request, res: Response): Promise<void> {
  res.set('Content-Type', 'text/html')
  res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileServerHits} times!</p>
  </body>
</html>`)
}


export async function handlerResetRequestHits(req: Request, res: Response): Promise<void> {
  if (config.api.platform !== "dev") {
    throw new Forbidden("not allowed")
  } 
  await deleteChirps()
  await deleteUsers()
  await deleteRefreshToken()
  config.api.fileServerHits = 0
  res.set('Content-Type', 'text/plain')
  res.send(`OK`)
}


