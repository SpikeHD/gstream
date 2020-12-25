const { app, BrowserWindow, ipcMain, dialog, protocol } = require('electron')
const child_process = require('child_process')
const path = require('path')
const fs = require('fs')
const settings = require('./ipc/settings')
const gameModule = require(`./modules/${settings.getSettings().module}`)

settings.setSetting('cachePath', gameModule.meta.cachePath)

const torrent = require('./ipc/torrent')
//const DirectClient = require('./ipc/direct')
const isDev = require("electron-is-dev")

//const directClient = new DirectClient()

if (gameModule.meta.imageCache) {
  const images = gameModule.meta.imageCache

  if (!fs.existsSync(app.getPath('appData') + '/gstream/images/')){
    fs.mkdirSync(app.getPath('appData') + '/gstream/images/')
  }

  if (!fs.existsSync(images)) {
    fs.mkdirSync(images)
  }
}

let win

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: !isDev
    }
  })
  // Use react localhost when on Dev, for hot reloading.
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "/index.html")}`
  )

  const cache = torrent.readCache()
  if(cache.length > 0) {
    cache.forEach(c => {
      torrent.startDownload(c.magnetURI, "", false)
    })
  }
}

app.whenReady().then(() => {
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURIComponent(request.url.replace('file:///', ''))
    callback(pathname)
  })

  createWindow()
  if (!isDev) win.removeMenu()
})

ipcMain.handle('getPlatform', () => {
  return process.platform
})

ipcMain.handle('getPath', (e, arg) => {
  return app.getPath(arg)
})

ipcMain.handle('getSettings', async () => {
  return await settings.getSettings()
})

ipcMain.handle('setSetting', async (e, args) => {
  return await settings.setSetting(args[0], args[1])
})

ipcMain.handle('getModuleList', async () => {
  // Requires in order to return meta info
  return await fs.readdirSync(__dirname + '/modules').map(f => {
    const meta = require(`./modules/${f}`).meta
    // Add filename to meta
    meta.filename = f
    return meta
  })
})

ipcMain.handle('getCachePath', () => {
  let cache = settings.getSettings().cachePath
  return app.getPath('appData') + '/gstream/' + cache
})

ipcMain.handle('allGames', async () => {
  return await gameModule.getAllGames(settings.getSettings().site)
})

ipcMain.handle('getGame', async (e, link) => {
  return await gameModule.getGame(link)
})

ipcMain.handle('getTorrent', async (e, arg) => {
  const client = await torrent.getClient()
  const t = client.torrents.find(c => c.name === arg)
  return t
})

ipcMain.handle('openDirSelect', async (args) => {
  return await dialog.showOpenDialogSync(win, {
    title: args.title,
    properties: ['openDirectory']
  })
})

// https://jijnasu.in/electron-open-file-explorer-with-file-selected/
ipcMain.handle('openInFiles', async (e, fpath) => {
  let command
  switch (process.platform) {
    case 'darwin':
      command = 'open -R ' + fpath
      break
    case 'win32':
      command = 'start ' + fpath.replace(/\//g, '\\')
      break;
    default:
      fpath = path.dirname(fpath)
      command = 'xdg-open ' + fpath
  }
  child_process.exec(command)
})

ipcMain.handle('getImage', async (e, link) => {
  const game = await gameModule.getGame(link)
  return game.image
})

/**
 * Chunk for direct downloads
 */
// ipcMain.handle('startDirect', async (e, args) => directClient.startDownload(args.link, args.folder))
// ipcMain.handle('stopDirect', async (e, name) => directClient.stopDownload(name))
// ipcMain.handle('getDetails', async (e, name) => directClient.getDownload(name))
/**
 * This giant chunk is just the ipc handlers for the torrent functions.
 * They're all basically self-explanatory.
 */
ipcMain.handle('getClientProgress', async () => torrent.getClientProgress())
ipcMain.handle('getAllTorrentDetails', async () => torrent.getAllTorrentsDetails())
ipcMain.handle('getIndividualTorrentsDetails', async (e, arg) => torrent.getIndividualTorrentsDetails(arg))
ipcMain.handle('startDownload', async (e, args) => torrent.startDownload(args[0], args[1], true))
ipcMain.handle('pauseTorrent', async (e, arg) => torrent.pauseTorrent(arg))
ipcMain.handle('resumeTorrent', async (e, arg) => torrent.resumeTorrent(arg))
ipcMain.handle('destroyTorrent', async (e, arg) => torrent.destroyTorrent(arg))
