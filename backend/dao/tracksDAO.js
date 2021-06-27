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
      console.log(items)
      for (let i in items){
        var count = 0;
        items[i]._id = items[i].id
        delete items[i].id

        tracks.find({_id: items[i]._id}, {_id : 1}).toArray(function (err, result) {
          if (err) throw err;
          
          if (result.length == 0){
            tracks.insertOne(items[i], (err, res) => {
              if (err) throw err; 
              
            })
          }
        })
      }
      console.log("insertions successful")
    }
  
  static async gettracks({
    filters = null,
    page = 0,
    tracksPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } }
      } else if ("track" in filters) {
        query = { "track": { $eq: filters["track"] } }
      } else if ("zipcode" in filters) {
        query = { "address.zipcode": { $eq: filters["zipcode"] } }
      }
    }

    let cursor
    
    try {
      cursor = await tracks
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { tracksList: [], totalNumtracks: 0 }
    }

    const displayCursor = cursor.limit(tracksPerPage).skip(tracksPerPage * page)

    try {
      const tracksList = await displayCursor.toArray()
      const totalNumtracks = await tracks.countDocuments(query)

      return { tracksList, totalNumtracks }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { tracksList: [], totalNumtracks: 0 }
    }
  }
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



