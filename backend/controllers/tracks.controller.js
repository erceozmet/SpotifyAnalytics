import tracksDAO from "../dao/tracksDAO.js"
import request from "request"
import querystring from "querystring"
import cookieParser from "cookie-parser";
import app from "../server.js";

export default class tracksController {
  static async apiGettracks(req, res, next) {
    try{
      var access_token = req.query.access_token || null;
      var refresh_token = req.query.refresh_token || null;
  
      if (access_token === null || refresh_token === null){
        res.redirect('/#' +
          querystring.stringify({
          error: 'token failed to retrieve'
        }));
      }
     
      var options = {
        url: 'https://api.spotify.com/v1/me/top/tracks?limit=50',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };
  
      request.get(options, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          let items = body.items
          

          tracksDAO.insertTracks(items)
          let inserted = "Inserted songs: "
          items.forEach(element => {
            inserted += element.name + "\n"
          });
          res.send(inserted)
        }
        else{
          res.redirect('/#' +
          querystring.stringify({
            error: `failed to retrieve top tracks, status code: ${response.statusCode}$`
        }));
        }
      });
      

      return

    } catch(e){
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  

    // const { tracksList, totalNumtracks } = await tracksDAO.gettracks({
    //   filters,
    //   page,
    //   tracksPerPage,
    // })

    // let response = {
    //   tracks: tracksList,
    //   page: page,
    //   filters: filters,
    //   entries_per_page: tracksPerPage,
    //   total_results: totalNumtracks,
    // }
  }

  
  static async createPlaylist(req, res, next){
   
    try{
       

      var userId = req.cookies ? req.cookies['currentUserId'] : null;
      var access_token = req.query.access_token || null;
      var refresh_token = req.query.refresh_token || null;
      

      
      if (userId != null && access_token != null){
        var options = {
          url: 'https://api.spotify.com/v1/users/' + userId + '/playlists',
          headers: { 'Authorization': 'Bearer ' + access_token },
          body: {
            "name": "Top Songs of The Week",
            "description": "Most listened songs by you and your friends",
            "public": true
          },
          json: true
        };
  
        
        request.post(options, function(error, response, body){

          if (!error && response.statusCode === 201) {
            console.log("playlist created")
            res.redirect(body.href)
          }
          else{
            res.redirect('/#' +
            querystring.stringify({
              error: `failed to create playlist: ${response.statusCode}$`
            }));
          }
        })
      }
      else{
        res.redirect('/#' +
        querystring.stringify({
          error: `failed to access token, status code: ${response.statusCode}$`
        }));
      }

    }catch(e){
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }


}
    
    
  
  static async apiGettrackById(req, res, next) {
    try {
      let id = req.params.id || {}
      let track = await tracksDAO.gettrackByID(id)
      if (!track) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(track)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGettrackCuisines(req, res, next) {
    try {
      let cuisines = await tracksDAO.getCuisines()
      res.json(cuisines)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}