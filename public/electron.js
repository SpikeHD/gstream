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

ipcMain.handle('getAllTorrents', async () => {
  const client = await torrent.getClient()
  return client.torrents
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

ipcMain.handle('getAllTorrentDetails', async () => {
  const client = await torrent.getClient()
  return client.torrents.map(t => {
    return {
      name: t.name,
      downloadSpeed: t.downloadSpeed,
      totalDownloaded: t.downloaded,
      uploadSpeed: t.uploadSpeed,
      totalUploaded: t.uploaded,
      timeRemaining: t.timeRemaining,
      size: t.pieceLength + t.lastPieceLength,
      magnetURI: t.magnetURI
    }
  })
})

ipcMain.handle('getIndividualTorrentsDetails', async (e, arg) => {
  const client = await torrent.getClient()
  // Use includes() because magnet is sometimes automatically shortened
  const t = client.torrents.find(t => t.magnetURI.includes(arg) || t.name === arg)
  if (t) {
    return {
      name: t.name,
      downloadSpeed: t.downloadSpeed,
      totalDownloaded: t.downloaded,
      uploadSpeed: t.uploadSpeed,
      totalUploaded: t.uploaded,
      timeRemaining: t.timeRemaining,
      progress: t.progress,
      size: t.length,
      magnetURI: t.magnetURI
    }
  } else return {name: 'none', magnetURI: 'none'}
})

ipcMain.handle('pauseTorrent', async (e, arg) => {
  const client = await torrent.getClient()
  const t = client.torrents.find(t => t.magnetURI.includes(arg) || t.name === arg)

  if (t) {
    t.pause()
    return true
  } else return false
})

ipcMain.handle('resumeTorrent', async (e, arg) => {
  const client = await torrent.getClient()
  const t = client.torrents.find(t => t.magnetURI.includes(arg) || t.name === arg)

  if (t) {
    t.add(t.magnetURI)
    return true
  } else return false
})

ipcMain.handle('destroyTorrent', async (e, arg) => {
  const client = await torrent.getClient()
  const t = client.torrents.find(t => t.magnetURI.includes(arg) || t.name === arg)

  if (t) {
    t.destroy()
    return true
  } else return false
})

ipcMain.handle('startMagnet', async (e, args) => {
  const magnet = args[0]
  const path = args[1]
  const client = await torrent.getClient()

  if (client.torrents.find(t => t.magnetURI.includes(args[0]))) return

  const t = await torrent.startDownload(magnet, path)
  curTorrents.push(t)

  // When finished, remove from cache
  t.on('done', async() => {
  })

  return {
    timeLeft: t.timeRemaining,
    name: t.name
  }
})
