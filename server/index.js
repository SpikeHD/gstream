const express = require('express')
const cors = require('cors')
const scraper = require('./scrapers')
const app = express()

app.use(cors())

app.get('/fitgirl', async (req, res) => {
  const data = await scraper.fitgirl()

  console.log(data)

  res.json({data: data})
})

app.listen(3001, () => {
  console.log('Local API server is up')
})

