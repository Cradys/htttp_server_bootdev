import express from "express";
import { handlerReadiness, handlerRequestHits, handlerResetRequestHits } from "./api/handlers/handlers.js";
import { handlerCreateUser, handlerUserLogin } from "./api/handlers/users.js";
import { middlewareCountRequest, middlewareLogResponses } from "./middleware/middleware.js";
import { errorHandler } from "./middleware/middleware.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerCreateChirps, handlerListChirps, handlerOneChirps } from "./api/handlers/chirps.js";


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

app.post("/api/users", handlerCreateUser)
app.post("/api/login", handlerUserLogin)

app.use(errorHandler)

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});


