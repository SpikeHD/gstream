const axios = require('axios')

/**
 * Scrape FitGirl repacks for links.
 * 
 * @todo Allow for preference of direct over torrent or vice-versa
 * 
 * @param {String} homepage 
 */
exports.getFitgirl = async (homepage) => {
  const res = await axios.get('http://localhost:3001/fitgirl')
  return res.data
}

/**
 * Scrape info from FitGirl game page.
 * 
 * @param {String} link 
 */
exports.getFirgirlGame = async (link) => {
  const res = await axios.post('http://localhost:3001/fitgirl/game', { body: { link: link } })
  return res.data
}