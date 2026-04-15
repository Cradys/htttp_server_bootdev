import { Request, Response } from "express"
import { config } from "../config.js"
import { errorHandler } from "./error_handlers.js"


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


export async function handlerValidateChirp(req: Request, res: Response): Promise<void> {
  type validateChirp = {
    body: string
  }

  try {
    const parseBody: validateChirp = req.body

    if (!parseBody.body) {
      errorHandler(400, "Something went wrong", res)
      return
    }

    if (parseBody.body.length > 140) {
      errorHandler(400, "Chirp is too long", res)
      return
    }

    let responseBody = {
      valid: true
    }

    res.status(200).send(JSON.stringify(responseBody))
    
  } catch (err) {
    console.log((err as Error).message)
    errorHandler(400, "Something went wrong", res)
  }
}
