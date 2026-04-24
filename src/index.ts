import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerReadiness, handlerRequestHits, handlerResetRequestHits } from "./api/handlers/handlers.js";
import { handlerCreateUser, handlerUpdateUser } from "./api/handlers/users.js";
import { middlewareCountRequest, middlewareLogResponses } from "./api/middleware.js";
import { errorHandler } from "./api/middleware.js";
import { handlerCreateChirps, handlerDeleteChirps, handlerListChirps, handlerOneChirps } from "./api/handlers/chirps.js";
import { handlerRefreshToken, handlerRevokeToken, handlerUserLogin } from "./api/auth.js";
import { handlerChirpyRed } from "./api/handlers/chirpy_red.js";


const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();


app.use("/app", middlewareCountRequest, express.static("./src/app"));
app.use(express.json())
app.use(middlewareLogResponses);


app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerRequestHits);
app.post("/admin/reset", handlerResetRequestHits)

app.get("/api/chirps", handlerListChirps)
app.get("/api/chirps/:chirpId", handlerOneChirps)
app.post("/api/chirps", handlerCreateChirps)
app.delete("/api/chirps/:chirpId", handlerDeleteChirps)

app.post("/api/users", handlerCreateUser)
app.put("/api/users", handlerUpdateUser)


app.post("/api/login", handlerUserLogin)
app.post("/api/refresh", handlerRefreshToken)
app.post("/api/revoke", handlerRevokeToken)

app.post("/api/polka/webhooks", handlerChirpyRed)

app.use(errorHandler)

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});


