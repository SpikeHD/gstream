let fs
let fgCache
let ipcRenderer

exports.setCache = (win, path, ipc) => {
  fs = win.require('fs')
  fgCache = path + '/gstream/'
  ipcRenderer = ipc
}

/**
 * Scrape FitGirl repacks for links.
 * 
 * @todo Allow for preference of direct over torrent or vice-versa
 */
exports.getFitgirl = async () => {
  const games = await ipcRenderer.invoke('fgAllGames')

  // Caching Section
  if (!fs.existsSync(fgCache + '/fg.json')) {
    if (!fs.existsSync(fgCache)) {
      await fs.mkdirSync(fgCache)
    }

    fs.writeFileSync(fgCache + '/fg.json', JSON.stringify(games), 'utf-8')
  } else {
    let data = JSON.parse(fs.readFileSync(fgCache + '/fg.json'))

    // games.forEach(g => {
    //   // Insert into correct position (instead of needing to sort array fully)
    //   if (data.indexOf(g) === -1) data.splice(games.indexOf(g), 0, g)
    // })

    // data.forEach(g => {
    //   // Remove from cache if it doesn't exist anymore
    //   if (games.indexOf(g) === -1) data.splice(data.indexOf(g), 1)
    // })

    fs.writeFileSync(fgCache + '/fg.json', JSON.stringify(data), 'utf-8')
  }

  return games.filter((g, i) => games.indexOf(g) === i)
}

/**
 * Get cached games from appData.
 */
module.exports.getCacheFitgirl = async () => {
  if (fs.existsSync(fgCache + '/fg.json')) {
    const games = await JSON.parse(fs.readFileSync(fgCache + '/fg.json'))
    return await games.filter((g, i) => games.indexOf(g) === i)
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
  return res
}