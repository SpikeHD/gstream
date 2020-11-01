const express = require('express')
const cors = require('cors')
const scraper = require('./scrapers')
const qs = require('qs')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/fitgirl', async (req, res) => {
  const data = await scraper.fitgirl.getAllGames()

  res.json(data)
})

app.post('/fitgirl/game', async (req, res) => {
  const data = await scraper.fitgirl.getGame(req.body.body.link)

  res.json(data)
})

app.listen(3001, () => {
  console.log('Local API server is up')
})

