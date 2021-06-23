import express from "express"
import fetch from "node-fetch"
import tracksCtrl from "./tracks.controller.js"
import ReviewsCtrl from "./reviews.controller.js"
import querystring from "querystring"

const router = express.Router()

router.route("/").get(tracksCtrl.apiGettracks)
router.route("/id/:id").get(tracksCtrl.apiGettrackById)
router.route("/cuisines").get(tracksCtrl.apiGettrackCuisines)

router
  .route("/review")
  .post(ReviewsCtrl.apiPostReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview)


//encodes http requests
const encodeFormData = (data) => {
  return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
}

router.route("/logged").get(
  async (req, res) => {
    const body = {
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: 'http://localhost:5000/spotifyanalytics/',
      client_id: process.env.SPOTIFYCLIENTID,
      client_secret: process.env.SPOTIFYCLIENTSECRET,
    }
  
    await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
      body: encodeFormData(body)
    }).catch(err => {console.error(err.stack)})
    .then(response => response.json())
    .then(data => {
      const query = querystring.stringify(data);
      res.redirect(`http://localhost:5000/spotifyanalytics/?${query}`);
    });
  });
export default router