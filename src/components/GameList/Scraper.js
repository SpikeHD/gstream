let fs
let fgCache
let window
let ipcRenderer

exports.setCache = (win, path, ipc) => {
  fs = window.require('fs')
  fgCache = path + '/gstream/fg.json'
  window = win
  ipcRenderer = ipc
}

/**
 * Scrape FitGirl repacks for links.
 * 
 * @todo Allow for preference of direct over torrent or vice-versa
 * 
 * @param {String} homepage 
 */
exports.getFitgirl = async (homepage) => {
  const res = await ipcRenderer.invoke('fgAllGames')
  const games = res.data

  // Caching Section
  if (!fs.existsSync(fgCache)) {
    fs.writeFileSync(fgCache, JSON.stringify(games), 'utf-8')
  } else {
    let data = JSON.parse(fs.readFileSync(fgCache))

    games.forEach(g => {
      // Insert into correct position (instead of needing to sort array fully)
      if (data.indexOf(g) === -1) data.splice(games.indexOf(g), 0, g)
    })

    data.forEach(g => {
      // Remove from cache if it doesn't exist anymore
      if (games.indexOf(g) === -1) data.splice(data.indexOf(g), 1)
    })

    fs.writeFileSync(fgCache, JSON.stringify(data), 'utf-8')
  }

  return res.data
}

/**
 * Get cached games from appData.
 */
module.exports.getCacheFitgirl = async () => {
  if (fs.existsSync(fgCache)) {
    return await JSON.parse(fs.readFileSync(fgCache))
  } else {
    return await this.getFitgirl()
  }
}

/**
 * Scrape info from FitGirl game page.
 * 
 * @param {String} link 
 */
exports.getFitgirlGame = async (link) => {
  const res = await ipcRenderer.invoke('fgGame', link)
  return res.data
}