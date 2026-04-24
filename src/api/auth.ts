import * as argon2 from "argon2";
import jwt from "jsonwebtoken"
import { randomBytes } from "node:crypto";
import type { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import { BadRequest, Forbidden, Unauthorized } from "./error_classes.js";
import { config } from "../config.js";
import { respondWithJSON } from "./handlers/response_json.js";
import { getUserByEmail } from "../db/queries/users.js";
import { createRefreshTokens, getRefreshToken, updateRefreshToken } from "../db/queries/refreshTokens.js";
import { getUserById } from "../db/queries/users.js";


export async function handlerUserLogin(req: Request, res: Response): Promise<void> {
  type parameters = {
    email: string,
    password: string,
    expiresInSeconds: number
  }
  const params: parameters = req.body
  let expiresInSeconds: number = config.jwt.defaultDuration

  if (!params.email || !params.password) {
    throw new Error("Not enough data")
  }

  const user = await getUserByEmail(params.email)

  if (!user) {
    throw new Unauthorized("User not found")
  }

  if (!await checkPasswordHash(params.password, user.hashedPassword)) {
    throw new Unauthorized("")
  }

  const token = makeJWT(
    user.id,
    expiresInSeconds
  )

  const refreshToken = makeRefreshToken()
  const refreshExpiration = new Date()
  refreshExpiration.setDate(refreshExpiration.getDate() + 60)
  
  const result = await createRefreshTokens({
    token: refreshToken,
    userId: user.id,
    expiresAt: refreshExpiration
  })
  

  
  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isChirpyRed: user.isChirpyRed,
    token: token,
    refreshToken: refreshToken
  })
}

export async function handlerAuth(req: Request) {
  const token = getBearerToken(req)
  const userId = validateJWT(token)
  const user = await getUserById(userId)
  
  if (!user) {
    throw new Unauthorized("user not found")
  }

  return user
}

export async function handlerRefreshToken(req: Request, res: Response): Promise<void> {
  const refreshToken = getBearerToken(req) 
  const tokenResult = await getRefreshToken(refreshToken)

  if (!tokenResult || tokenResult.expiresAt.getTime() < Date.now() || tokenResult.revokedAt) {
    throw new Unauthorized("Not valid refresh token")
  }
  
  const token = makeJWT(tokenResult.userId, config.jwt.defaultDuration)

  respondWithJSON(res, 200, {token: token})
}

export async function handlerRevokeToken(req: Request, res: Response): Promise<void> {
  const refreshToken = getBearerToken(req)

  await updateRefreshToken(refreshToken, new Date())

  respondWithJSON(res, 204)
}

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password)
}


export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
  return argon2.verify(hash, password)
}


type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;


export function makeJWT(userID: string, expiresIn: number) {
  // current time in seconds
  const nowDate = Math.floor(Date.now() / 1000)

  let payload: payload = {
    iss: config.jwt.issuer,
    sub: userID,
    iat: nowDate,
    exp: nowDate + expiresIn
  }
  
  const token = jwt.sign(payload, config.jwt.secret)
  return token
}


export function validateJWT(tokenString: string) {
  let decoded: payload

  try {
    decoded = jwt.verify(tokenString, config.jwt.secret) as JwtPayload

  } catch (err) {
    console.log((err as Error).message)
    throw new Unauthorized("Invalid token")
  }

  if (decoded.iss !== config.jwt.issuer) {
    throw new Unauthorized("Invalid issuer");
  }

  if (!decoded.sub) {
    throw new Unauthorized("No user ID in token");
  }

  return decoded.sub

}

export function getBearerToken(req: Request): string {
  const rawToken = req.header("Authorization")

  if (!rawToken) {
    throw new Unauthorized("Authorization token not found")
  }

  const token = rawToken.slice(7).trim()

  return token
}

export function getApiKey(req: Request): string {
  const header = req.header("Authorization")
  
  if (!header) {
    throw new Unauthorized("Authorization token not found")
  }

  const splitAuth = header.split(" ")

  if (splitAuth.length < 2 || splitAuth[0] !== "ApiKey") {
    throw new BadRequest("Malformed authorization header");
  }
  return splitAuth[1];
}


export function makeRefreshToken(): string {
  return randomBytes(32).toString('hex')
}


