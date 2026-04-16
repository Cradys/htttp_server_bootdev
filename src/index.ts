import express from "express";
import { handlerReadiness, handlerRequestHits, handlerResetRequestHits, handlerValidateChirp } from "./api/handlers/handlers.js";
import { handlerCreateUser } from "./api/handlers/user_hndr.js";
import { middlewareCountRequest, middlewareLogResponses } from "./middleware/middleware.js";
import { errorHandler } from "./middleware/middleware.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";


const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();


app.use("/app", middlewareCountRequest, express.static("./src/app"));
app.use(express.json())
app.use(middlewareLogResponses);


app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerRequestHits);
app.post("/admin/reset", handlerResetRequestHits)
app.post("/api/validate_chirp", handlerValidateChirp)

app.post("/api/users", handlerCreateUser)

app.use(errorHandler)

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});


