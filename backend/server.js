import express, { request } from "express"
import cors from "cors"
import tracks from "./routes/tracks.route.js"
import spotifyApi from "./routes/spotifyapi.route.js"
const app = express()

app.use(cors())
app.use(express.json())

app.use("/spotifyanalytics", tracks)
app.use("/spotify", spotifyApi)

app.use("*", (req, res) => res.status(404).json({ error: "not found"}))




export default app;