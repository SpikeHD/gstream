const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')
const app = require('electron').app
const imageCachePath = app.getPath('appData') + '/gstream/images/su/'

/**
 * Meta infomation
 */
module.exports.meta = {
  name: "Steamunlocked",
  description: "Games list for Steamunlocked",
  cachePath: "su.json",
  imageCache: imageCachePath
}

/**
 * Get JSON formatted games list.
 * 
 * @param {String} homepage 
 */
module.exports.getAllGames = async (homepage) => {
  const res = await axios.get(homepage)
  let $ = cheerio.load(res.data)
  let games = []

  const DOMlist = $('.blog-post .blog-content ul li')

  DOMlist.each((i, e) => {
    games.push({
      name: $(e).find('a').text().trim().split(' Free Download')[0],
      link: $(e).find('a').attr('href'),
      image: null
    })
  })

  return games
}

/**
 * Get details of game page
 * 
 * @param {String} link 
 */
module.exports.getGame = async (link) => {
  const res = await axios.get(link)
  const $ = cheerio.load(res.data)
  const image = $('.blog-content p img').prop('data-src')
  const imageName = image.split('/')[image.split('/').length -1]
  const localPath = imageCachePath + imageName

  // Since this one requires caching images locally, we will download it an provide a local path
  if (!fs.existsSync(localPath)) {
    const imageWriteStream = fs.createWriteStream(localPath)
    const imageRes = await axios.get(image, {responseType: 'stream'})
    imageRes.data.pipe(imageWriteStream)
    await new Promise(fulfill => imageWriteStream.on("finish", fulfill))
  }

  const links = [{
    name: 'Main',
    links: [{
      title: 'Download',
      link: $('.blog-content p a.btn-download').first().attr('href')
    }]
  }]
  const description = $('#game_area_description').text().trim()

  return {
    items: links,
    image: 'file://' +localPath,
    description: description
  }
}