const {app, BrowserWindow, ipcMain} = require('electron')
const fs = require('fs')
const fg = require('./ipc/fitgirl')
const torrent = require('./ipc/torrent')
let curTorrents = []

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 720,
    webPreferences: {
      preload: './preload.js',
      nodeIntegration: true
    }
  })
  win.loadURL('http://localhost:3000')
}

app.whenReady().then(async () => {
  createWindow()

  let torrentsCache

  // Get and start cached torrents
  if(fs.existsSync(app.getPath('appData') + '/gstream/torrents.json')) {
    torrentsCache = JSON.parse(fs.readFileSync(app.getPath('appData') + '/gstream/torrents.json'))
    torrentsCache.forEach(t => torrent.startDownload(t.magnet, t.path))
  }
})

ipcMain.handle('getPath', (e, arg) => {
  return app.getPath(arg)
})

ipcMain.handle('fgAllGames', async () => {
  return await fg.getAllGames()
})

ipcMain.handle('fgGame', async (e, link) => {
  return await fg.getGame(link)
})

ipcMain.handle('getTorrent', async (e, arg) => {
  const t = curTorrents.find(c => c.name === arg)
  return t
})

ipcMain.handle('getAllTorrents', async () => {
  return curTorrents
})

ipcMain.handle('getClientProgress', async () => {
  const client = await torrent.getClient()
  
  return {
    progress: client.progress,
    downloadSpeed: client.downloadSpeed,
    uploadSpeed: client.uploadSpeed,
    items: client.torrents.length
  }
})

ipcMain.handle('startMagnet', async (e, args) => {
  const magnet = args[0]
  const path = args[1]
  const t = await torrent.startDownload(magnet, path)
  const cTorrents = (await torrent.getClient()).torrents.map(tor => {
    return {magnet: tor.magnetURI, path: tor.path}
  })
  curTorrents.push(t)

  await fs.writeFileSync(app.getPath('appData') + '/gstream/torrents.json', JSON.stringify(cTorrents), 'utf-8')

  // When finished, remove from cache
  t.on('done', async() => {
    cTorrents.splice(cTorrents.indexOf(t.magnetURI), 1)
    await fs.writeFileSync(app.getPath('appData') + '/gstream/torrents.json', JSON.stringify(cTorrents), 'utf-8')
  })

  return {
    timeLeft: t.timeRemaining,
    name: t.name
  }
})
