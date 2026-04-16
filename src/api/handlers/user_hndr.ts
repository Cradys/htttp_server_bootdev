import { Request, Response } from "express";
import { createUser } from "../../db/queries/users.js";
import { BadRequest } from "../error_classes.js";
import { respondWithJSON, responseWithError } from "./response_json.js";

export async function handlerCreateUser(req: Request, res: Response): Promise<void> {
  type parameters = {
    email: string
  }

  const params: parameters = req.body

  if (!params.email) {
    throw new Error("Something went wrong")
  }

  if (params.email.length === 0) {
    throw new BadRequest("not valid email")
  }

  const user = await createUser({email: params.email})

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  })
}