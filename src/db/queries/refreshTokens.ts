import { eq } from "drizzle-orm"
import { db } from "../index.js"
import { NewRefreshTokens, refreshTokens } from "../schema.js"

export async function createRefreshTokens(tokens: NewRefreshTokens) {
  const [result] = await db
    .insert(refreshTokens)
    .values(tokens)
    .onConflictDoNothing()
    .returning()
  return result
}


export async function getRefreshToken(token: string) {
  const [result] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token))
  return result
}

export async function updateRefreshToken(token: string, revokedAt: Date) {
  await db.update(refreshTokens).set({revokedAt: revokedAt}).where(eq(refreshTokens.token, token))
  return 
}

export async function deleteRefreshToken() {
  await db.delete(refreshTokens)
}