let fs
let fgCache
let ipcRenderer

class Scraper {
  constructor(win, path, ipc) {
    fs = win.require('fs')
    fgCache = path + '/fg.json'
    ipcRenderer = ipc
  }

  /**
   * Scrapefor links.
   * 
   * @todo Allow for preference of direct over torrent or vice-versa
   */
  getGames = async () => {
    const games = await ipcRenderer.invoke('allGames')
  
    // Caching Section
    if (!fs.existsSync(fgCache + '/fg.json')) {
      if (!fs.existsSync(fgCache)) {
        await fs.mkdirSync(fgCache)
      }
  
      fs.writeFileSync(fgCache + '/fg.json', JSON.stringify(games), 'utf-8')
    } else {
      let data = JSON.parse(fs.readFileSync(fgCache + '/fg.json'))
      fs.writeFileSync(fgCache + '/fg.json', JSON.stringify(data), 'utf-8')
    }
  
    return games.filter((g, i) => games.indexOf(g) === i)
  }

  /**
   * Get cached games from appData.
   */
  getGameCache = async () => {
    if (fs.existsSync(fgCache + '/fg.json')) {
      const games = await JSON.parse(fs.readFileSync(fgCache + '/fg.json'))
      return await games.filter((g, i) => games.indexOf(g) === i)
    } else {
      return await this.getGames()
    }
  }

  /**
   * Scrape info from game page.
   * 
   * @param {String} link 
   */
  getGame = async (link) => {
    const res = await ipcRenderer.invoke('getGame', link)
    return res
  }
}

export default Scraper