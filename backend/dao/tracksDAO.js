import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
import lodash from 'lodash'
let tracks

export default class tracksDAO {
  static async injectDB(conn) {
    if (tracks) {
      return
    }
    try {
      tracks = await conn.db(process.env.SPOTIFYANALYTICS_NS).collection("tracks")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in tracksDAO: ${e}`,
      )
    }
  }

  static async insertTracks(items){
    let inserted_song_names = []
    for (let i in items){
    
      items[i]._id = items[i].id
      delete items[i].id

      tracks.find({_id: items[i]._id}, {_id : 1}).toArray(function (err, result) {
        if (err) throw err;
        if (result.length == 0){
          inserted_song_names.push(items[i].name)
          tracks.insertOne(items[i], (err, res) => {
            if (err) throw err; 
          })
        }
        else{
          console.log(items[i].name + " is already in db, skipping...\n")
        }
      })
    }
    console.log("insertions successful")
  }
  
  // static async gettracks(){

  // }
  static async getTrackByID(id) {
    try {
      const pipeline = [
        {
            $match: {
                _id: new ObjectId(id),
            },
        },
              {
                  $lookup: {
                      from: "reviews",
                      let: {
                          id: "$_id",
                      },
                      pipeline: [
                          {
                              $match: {
                                  $expr: {
                                      $eq: ["$Track_id", "$$id"],
                                  },
                              },
                          },
                          {
                              $sort: {
                                  date: -1,
                              },
                          },
                      ],
                      as: "reviews",
                  },
              },
              {
                  $addFields: {
                      reviews: "$reviews",
                  },
              },
          ]
      return await tracks.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getTrackByID: ${e}`)
      throw e
    }
  }

  static async gettracks() {
    let tracks = []
    try {
      tracks = await tracks.distinct("track")
      return tracks
    } catch (e) {
      console.error(`Unable to get tracks, ${e}`)
      return tracks
    }
  }
}



