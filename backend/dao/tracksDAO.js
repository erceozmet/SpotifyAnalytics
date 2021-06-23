import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
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

  static async gettracks({
    filters = null,
    page = 0,
    tracksPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } }
      } else if ("cuisine" in filters) {
        query = { "cuisine": { $eq: filters["cuisine"] } }
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

  static async getCuisines() {
    let cuisines = []
    try {
      cuisines = await tracks.distinct("cuisine")
      return cuisines
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`)
      return cuisines
    }
  }
}



