import { eq } from "drizzle-orm";
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

export async function listChirps(chirpId?: string) {
  const result = await db
    .select()
    .from(chirps)
    .where(chirpId ? eq(chirps.id, chirpId): undefined)
    .orderBy(chirps.createdAt)
  return result
}
