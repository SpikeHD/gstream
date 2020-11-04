const {app, BrowserWindow, ipcMain} = require('electron')
const fs = require('fs')
const fg = require('./ipc/fitgirl')
const torrent = require('./ipc/torrent')

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

  /*
  let torrentsCache

  // Get and start cached torrents
  if(fs.existsSync(app.getPath('appData') + '/gstream/torrents.json')) {
    torrentsCache = JSON.parse(fs.readFileSync(app.getPath('appData') + '/gstream/torrents.json'))
    torrentsCache.forEach(t => torrent.startDownload(t.magnet, t.path))
  }
  */
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
  const client = await torrent.getClient()
  const t = client.torrents.find(c => c.name === arg)
  return t
})

// Torrent action handler
ipcMain.handle('getClientProgress', async () => torrent.getClientProgress())
ipcMain.handle('getAllTorrentDetails', async () => torrent.getAllTorrentsDetails())
ipcMain.handle('getIndividualTorrentsDetails', async (e, arg) => torrent.getIndividualTorrentsDetails(arg))
ipcMain.handle('startMagnet', async (e, args) => torrent.startMagnet(args))
ipcMain.handle('pauseTorrent', async (e, arg) => torrent.pauseTorrent(arg))
ipcMain.handle('resumeTorrent', async (e, arg) => torrent.resumeTorrent(arg))
ipcMain.handle('destroyTorrent', async (e, arg) => torrent.destroyTorrent(arg))
