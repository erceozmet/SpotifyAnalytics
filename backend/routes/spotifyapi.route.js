import express from "express"
import fetch from "node-fetch"
import request from "request"
import querystring from "querystring"

const apiRouter = express.Router()

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
var stateKey = 'spotify_auth_state';


apiRouter.route('/login').get(function(req, res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
    var scopes = 'user-read-recently-played user-top-read user-read-currently-playing user-read-recently-played';
    res.redirect('https://accounts.spotify.com/authorize' +
    querystring.stringify({
        response_type: 'code',
        client_id: 'd8b5b6593ac9455e8335aaf796ae4af2',
        scope: encodeURIComponent(scopes),
        redirect_uri: 'http://localhost:5000/spotifyanalytics/',
        state: state
      }));
});



var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFYCLIENTID + ':' + process.env.SPOTIFYCLIENTSECRET).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };




export default apiRouter