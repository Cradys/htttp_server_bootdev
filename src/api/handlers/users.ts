import { Request, Response } from "express";
import { createUser, getUserById, updateUser } from "../../db/queries/users.js";
import { BadRequest, Unauthorized } from "../error_classes.js";
import { respondWithJSON } from "./response_json.js";
import { checkPasswordHash, getBearerToken, handlerAuth, hashPassword, makeJWT, validateJWT } from "../auth.js";
import { config } from "../../config.js";


export async function handlerCreateUser(req: Request, res: Response): Promise<void> {
  type parameters = {
    email: string,
    password: string
  }

  const params: parameters = req.body

  if (!params.email || !params.password) {
    throw new Error("Not enough data")
  }

  if (params.email.length === 0) {
    throw new BadRequest("not valid email")
  }

  // if (params.password.length < 8) {
  //   throw new BadRequest("password must be at least 8 symbols")
  // }

  const hashedPassword = await hashPassword(params.password)

  const user = await createUser({email: params.email, hashedPassword: hashedPassword})

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isChirpyRed: user.isChirpyRed
  })
}

export async function handlerUpdateUser(req: Request, res: Response): Promise<void> {
  type parameters = {
    email: string,
    password: string
  }
  
  const user = await handlerAuth(req)

  const params: parameters = req.body

  user.hashedPassword = await hashPassword(params.password)
  user.email = params.email

  const result = await updateUser(user)

  respondWithJSON(res, 200, {
    id: result.id,
    email: result.email,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
    isChirpyRed: user.isChirpyRed,
  })
}

