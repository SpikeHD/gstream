const cheerio = require('cheerio')
const axios = require('axios')

/**
 * Meta info
 */
module.exports.meta = {
  name: 'Vimm\'s Lair',
  description: 'Games list from Vimm\'s Lair',
  cachePath: 'vimm.json',
  imageCache: null
}

/**
 * Get all games
 * 
 * @param {String} homepage 
 */
module.exports.getAllGames = async (homepage) => {
  const alphabet = ['number', ...'abcdefghijklmnopqrstuvwxyz'.split('')]
  const root = homepage.split('?')[0]
  const res = await axios.get(homepage)
  let $ = cheerio.load(res.data)
  let games = []
  let consoleCount = 0

  // First, go through each console/handheld
  const consoles = $('table tr td table tbody tr td a')
  consoleCount = consoles.length

  // Use yucky regular for loop for async/await reasons.
  // Is that weird? Is liking the other for loop types better weird?
  // I hope not.
  for (let i = 0; i < consoleCount; i++) {
    console.log(i)
    for (let x = 0; x < alphabet.length; x++) {
      console.log(x)
      // Get console name from href to construct proper link
      const consoleName =$(consoles[i]).attr('href').split('/vault/')[1]
      const aToZ = await axios.get(root + '/vault/?p=list&system=' + consoleName + '&section=' + alphabet[x].toUpperCase())
      $ = cheerio.load(aToZ.data)
  
      // Since the games list table is the only table that has odd/even classes on
      // the rows, we use those as selectors
      const gameRows = $('table tr.odd, table tr.even')

      gameRows.each((i, e) => {
        const elm = $(e).children('td').first().find('a')
        const gameLink = root + elm.attr('href')
        const gameName = elm.text().trim()

        games.push({
          name: gameName,
          link: gameLink,
          image: null
        })
      })
    }
  }

  console.log(games)

  return games
}

/**
 * Get game details
 * 
 * @param {String} link 
 */
module.exports.getGame = async (link) => {
  const root = link.split('/vault/')[0]
  const res = await axios.get(link)
  const $ = cheerio.load(res.data)

  let image = root +  $('#innerMain img[src*="type=box"]').attr('src')
  const links = [{
    name: 'Main',
    links: [{
      title: 'Download',
      link: root + $('form#download_form').first().attr('action')
    }]
  }]

  // Just in case there isn't any box art, just get the first image.
  if (!image) {
    image = root + $('#innerMain img').not('img[src="/images/clear.gif"]').first().attr('src')
  }

  // TODO make the description... good... I guess
  const description = `No game information available on Vimm.`

  return {
    items: links,
    image: image,
    description: description
  }
}