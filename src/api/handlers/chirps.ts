import { Request, Response, NextFunction } from "express"
import { BadRequest, NotFound } from "../error_classes.js"
import { createChirps, listChirps } from "../../db/queries/chirps.js"
import { respondWithError, respondWithJSON } from "./response_json.js"


export async function handlerCreateChirps(req: Request, res: Response, next: NextFunction): Promise<void> {
  type validateChirp = {
    body: string,
    userId: string
  }

  try {
    const parseBody: validateChirp = req.body

    if (!parseBody.body) {
      throw new Error("Something went wrong")
    }

    if (parseBody.body.length > 140) {
      throw new BadRequest("Chirp is too long. Max length is 140")
    }

    const chirp = await createChirps(parseBody)

    respondWithJSON(res, 201, chirp)
    
  } catch (err) {
    next(err)
  }
}

export async function handlerListChirps(req: Request, res: Response, next: NextFunction): Promise<void> {
  const result = await listChirps()
  respondWithJSON(res, 200, result)
} 

export async function handlerOneChirps(req: Request, res: Response, next: NextFunction): Promise<void> {
  const chirpId = req.params.chirpId as string
  try {
    const result = await listChirps(chirpId)

    if (result.length === 0) {
      throw new NotFound("not found")
    }

    respondWithJSON(res, 200, result[0])
  
  } catch(err) {
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