const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const child_process = require('child_process')
const path = require('path')
const fs = require('fs')
const fg = require('./ipc/fitgirl')
const torrent = require('./ipc/torrent')

const isDev = require("electron-is-dev")

let win

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
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

  const cache = torrent.readCache()
  if(cache.length > 0) {
    cache.forEach(c => {
      torrent.startDownload(c.magnetURI, "", false)
    })
  }
}

app.whenReady().then(() => {
  createWindow()
  if (!isDev) win.removeMenu()
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

ipcMain.handle('openDirSelect', async (args) => {
  return dialog.showOpenDialogSync(win, {
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

ipcMain.handle('getFitgirlImage', async (e, link) => {
  const game = await fg.getGame(link)
  
  return game.image
})

// Torrent action handler
ipcMain.handle('getClientProgress', async () => torrent.getClientProgress())
ipcMain.handle('getAllTorrentDetails', async () => torrent.getAllTorrentsDetails())
ipcMain.handle('getIndividualTorrentsDetails', async (e, arg) => torrent.getIndividualTorrentsDetails(arg))
ipcMain.handle('startDownload', async (e, args) => torrent.startDownload(args[0], args[1], true))
ipcMain.handle('pauseTorrent', async (e, arg) => torrent.pauseTorrent(arg))
ipcMain.handle('resumeTorrent', async (e, arg) => torrent.resumeTorrent(arg))
ipcMain.handle('destroyTorrent', async (e, arg) => torrent.destroyTorrent(arg))
