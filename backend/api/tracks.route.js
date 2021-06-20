import express from "express"
const router = express.Router()

router.route("/tracks").get ((req, res) => res.send("hello world"))

export default router