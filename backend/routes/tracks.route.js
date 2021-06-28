import express from "express"
import fetch from "node-fetch"
import tracksCtrl from "../controllers/tracks.controller.js"
import ReviewsCtrl from "../controllers/reviews.controller.js"


const router = express.Router()

router.route("/").get(tracksCtrl.apiGettracks)

router.route("/create-playlist-from-db").post(tracksCtrl.createPlaylist)
router.route("*").get((req, res) => res.status(404).json({ error: "page not found"}))


router.route("/id/:id").get(tracksCtrl.apiGettrackById)
router.route("/cuisines").get(tracksCtrl.apiGettrackCuisines)



export default router