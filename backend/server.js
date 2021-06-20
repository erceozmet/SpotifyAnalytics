import express, {json} from "express";
import cors from "cors";
import route from "./api/tracks.route.js"

const app = express();

app.use(cors);
app.use(json());
app.use("/api/v1/user", route);
app.use("*", (req, res) => res.status(404).json({ error: "page not found"}))


export default app;