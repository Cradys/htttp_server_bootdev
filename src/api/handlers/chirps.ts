import { Request, Response, NextFunction } from "express"
import { BadRequest, Forbidden, NotFound } from "../error_classes.js"
import { createChirps, deleteChirpsById, getChirpByIdAndUserId, getChirpByUserId, listChirps } from "../../db/queries/chirps.js"
import { respondWithError, respondWithJSON } from "./response_json.js"
import { getBearerToken, handlerAuth, validateJWT } from "../auth.js"
import { chirps, NewChirps } from "../../db/schema.js"


export async function handlerCreateChirps(req: Request, res: Response, next: NextFunction): Promise<void> {
  type params = {
    body: string
  }

  try {
    const reqBody: params = req.body
    let validChirp: NewChirps

    if (!reqBody.body) {
      throw new Error("Something went wrong")
    }

    if (reqBody.body.length > 140) {
      throw new BadRequest("Chirp is too long. Max length is 140")
    }

    const token = getBearerToken(req)
    const userID = validateJWT(token)

    validChirp = {
      body: findProfane(reqBody.body),
      userId: userID
    }

    const chirp = await createChirps(validChirp)

    respondWithJSON(res, 201, chirp)
    
  } catch (err) {
    next(err)
  }
}

export async function handlerListChirps(req: Request, res: Response, next: NextFunction): Promise<void> {
  let authorId = ""
  let sort = ""
  let result
  if (typeof req.query.authorId === "string") {
    authorId = req.query.authorId 
    result = await getChirpByUserId(authorId)
  } else {
    result = await listChirps()

    if (typeof req.query.sort === "string") {
    sort = req.query.sort
    
    if (sort === "desc") {
      result.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1
        }
        if (a.createdAt < b.createdAt) {
          return 1
        }
        return 0
      })
    }
  } 
  }

  
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

export async function handlerDeleteChirps(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await handlerAuth(req)
    const chirpIdToDelete = req.params.chirpId as string

    const [userChirpFromDB] = await listChirps(chirpIdToDelete)

    if (!userChirpFromDB) {
      throw new NotFound("Chirp not found")
    } 

    if (user.id != userChirpFromDB.userId) {
      throw new Forbidden("User does not have this chirp")
    }

    await deleteChirpsById(chirpIdToDelete)

    respondWithJSON(res, 204)
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