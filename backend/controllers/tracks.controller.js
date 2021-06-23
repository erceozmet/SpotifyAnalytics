import tracksDAO from "../dao/tracksDAO.js"

export default class tracksController {
  static async apiGettracks(req, res, next) {
    const tracksPerPage = req.query.tracksPerPage ? parseInt(req.query.tracksPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode
    } else if (req.query.name) {
      filters.name = req.query.name
    }

    const { tracksList, totalNumtracks } = await tracksDAO.gettracks({
      filters,
      page,
      tracksPerPage,
    })

    let response = {
      tracks: tracksList,
      page: page,
      filters: filters,
      entries_per_page: tracksPerPage,
      total_results: totalNumtracks,
    }
    res.json(response)
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