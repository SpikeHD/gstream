const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const fg = require('./ipc/fitgirl')
const torrent = require('./ipc/torrent')

const isDev = require("electron-is-dev")

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "/index.html")}`
  )

  console.log(__dirname)

  const cache = torrent.readCache()
  if(cache.length > 0) {
    cache.forEach(c => {
      torrent.startDownload(c.magnetURI, "")
    })
  }
}

app.whenReady().then(() => createWindow())

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
