import { Request, Response } from "express"
import { respondWithJSON } from "./response_json.js"
import { getUserById, updateUserChirpyRed } from "../../db/queries/users.js"
import { NotFound, Unauthorized } from "../error_classes.js"
import { getApiKey } from "../auth.js"
import { config } from "../../config.js"

export async function handlerChirpyRed(req: Request, res: Response): Promise<void> {
  type parameters = {
    event: string,
    data: {
      userId: string
    }
  }

  const params: parameters = req.body

  const token = getApiKey(req)

  if (token !== config.webhook.polkaKey) {
    throw new Unauthorized("token not valid")
  }

  if (params.event !== "user.upgraded") {
    respondWithJSON(res, 204)
    return
  }

  const user = getUserById(params.data.userId)

  if (!user) {
    throw new NotFound("user not found")
  }
  
  await updateUserChirpyRed(params.data.userId)

  respondWithJSON(res, 204)
}