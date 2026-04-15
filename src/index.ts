import express from "express";
import { handlerReadiness, handlerRequestHits, handlerResetRequestHits, handlerValidateChirp } from "./handlers/handlers.js";
import { middlewareCountRequest, middlewareLogResponses } from "./middleware/middleware.js";

const app = express();
const PORT = 8080;


app.use("/app", middlewareCountRequest, express.static("./src/app"));
app.use(express.json())
app.use(middlewareLogResponses);


app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerRequestHits);
app.post("/admin/reset", handlerResetRequestHits)
app.post("/api/validate_chirp", handlerValidateChirp)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

