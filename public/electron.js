const {app, BrowserWindow, ipcMain} = require('electron')
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

app.whenReady().then(createWindow)

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
    uploadSpeed: client.uploadSpeed
  }
})

ipcMain.handle('startMagnet', async (e, args) => {
  const magnet = args[0]
  const path = args[1]
  const t = await torrent.startDownload(magnet, path)
  curTorrents.push(t)

  return {
    timeLeft: t.timeRemaining,
    name: t.name
  }
})