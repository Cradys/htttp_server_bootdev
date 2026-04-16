import { NextFunction, Request, Response } from "express"
import { NotFound, BadRequest, Forbidden } from "../error_classes.js"
import { config } from "../../config.js"
import { deleteUsers } from "../../db/queries/users.js"


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
  await deleteUsers()
  config.api.fileServerHits = 0
  res.set('Content-Type', 'text/plain')
  res.send(`OK`)
}


export async function handlerValidateChirp(req: Request, res: Response, next: NextFunction): Promise<void> {
  type validateChirp = {
    body: string
  }

  try {
    const parseBody: validateChirp = req.body

    if (!parseBody.body) {
      throw new Error("Something went wrong")
    }

    if (parseBody.body.length > 140) {
      throw new BadRequest("Chirp is too long. Max length is 140")
    }

    let responseBody = { cleanedBody: findProfane(parseBody.body) }

    res.status(200).send(JSON.stringify(responseBody))
    
  } catch (err) {
    next(err)
  }
}


function findProfane(message: string) {
  const profane = ["kerfuffle", "sharbert", "fornax"]
  const words = message.split(" ")
  for (let i in words) {
    const lowerWord = words[i].toLowerCase()
    if (profane.includes(lowerWord)) {
      words[i] = "****"
    }
  }
  return words.join(" ")
}