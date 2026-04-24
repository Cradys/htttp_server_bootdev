import { and, eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewChirps, chirps } from "../schema.js";

export async function createChirps(chirp: NewChirps) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getChirpByUserId(userId: string) {
  const result = await db
    .select()
    .from(chirps)
    .where(eq(chirps.userId, userId))
  return result
}

export async function listChirps(chirpId?: string) {
  const result = await db
    .select()
    .from(chirps)
    .where(chirpId ? eq(chirps.id, chirpId): undefined)
    .orderBy(chirps.createdAt)
  return result
}

export async function deleteChirps() {
  await db.delete(chirps)
}

export async function deleteChirpsById(chirpId: string) {
  const [result] = await db
    .delete(chirps)
    .where(eq(chirps.id, chirpId))
    .returning()
  return result
}

export async function getChirpByIdAndUserId(chirpId: string, userId: string) {
  console.log(`userId: ${userId}\n chirpId: ${chirpId}`)
  const [result] = await db
    .select()
    .from(chirps)
    .where(
      and(
      eq(chirps.id, chirpId),
      eq(chirps.userId, userId)
    ))
    .orderBy(chirps.createdAt)
  console.log(result)
  return result
}