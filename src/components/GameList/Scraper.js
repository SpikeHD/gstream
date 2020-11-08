let fs
let gameCache
let ipcRenderer

class Scraper {
  constructor(win, path, ipc) {
    fs = win.require('fs')
    gameCache = path
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
    if (!fs.existsSync(gameCache)) {
      await fs.mkdirSync(gameCache)
      fs.writeFileSync(gameCache, JSON.stringify(games), 'utf-8')
    } else {
      let data = JSON.parse(fs.readFileSync(gameCache))
      fs.writeFileSync(gameCache, JSON.stringify(data), 'utf-8')
    }
  
    return games.filter((g, i) => games.indexOf(g) === i)
  }

  /**
   * Get cached games from appData.
   */
  getGameCache = async () => {
    if (fs.existsSync(gameCache)) {
      const games = await JSON.parse(fs.readFileSync(gameCache))
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