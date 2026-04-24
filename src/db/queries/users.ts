import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { NewUser, users } from "../schema.js";

type UpdateUser = Omit<NewUser, "id"> & { id: string };

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteUsers() {
  await db.delete(users);
}

export async function getUserByEmail(email: string) {
  const [result] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
    return result
}

export async function getUserById(id: string) {
  const [result] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
    return result
}

export async function updateUser(user: UpdateUser) {
  const [result] = await db
    .update(users)
    .set(user)
    .where(eq(users.id, user.id))
    .returning()
  return result
}

export async function updateUserChirpyRed(userId: string) {
  await db.update(users).set({isChirpyRed: true})
}