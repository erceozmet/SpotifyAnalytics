import express from "express"
import fetch from "node-fetch"
import tracksCtrl from "../controllers/tracks.controller.js"
import ReviewsCtrl from "../controllers/reviews.controller.js"


const router = express.Router()

router.route("/").get(tracksCtrl.apiGettracks)
router.route("/id/:id").get(tracksCtrl.apiGettrackById)
router.route("/cuisines").get(tracksCtrl.apiGettrackCuisines)

router
  .route("/review")
  .post(ReviewsCtrl.apiPostReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview)


export default router