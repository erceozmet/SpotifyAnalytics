import express, { request } from "express"
import cors from "cors"
import tracks from "./api/tracks.route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/spotifyanalytics", tracks)

app.get('/login', function(req, res) {
    var scopes = 'user-read-recently-played user-top-read user-read-currently-playing user-read-recently-played';
    res.redirect('https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' + process.env.SPOTIFYCLIENTID +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent('http://localhost:5000/spotifyanalytics/'));
    });




// var authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     form:{
//      code: code,
//      redirect_uri: process.env.REDIRECT_URI,
//      grant_type: 'authorization_code'
//     },
//     headers:{
//         'Authorization' : 'Basic ' + (new Buffer(process.env.SPOTIFYCLIENTID + ':' + process.env.SPOTIFYCLIENTSECRET).toString('base64'))
//     },
//     json: true
// };

// request.post(authOptions, function(error, res, body){})

app.use("*", (req, res) => res.status(404).json({ error: "not found"}))




export default app