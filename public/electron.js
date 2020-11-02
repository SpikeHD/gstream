const {app, BrowserWindow, ipcMain} = require('electron')
const fg = require('./ipc/fitgirl')

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

ipcMain.handle('getAppData', () => {
  console.log('get app data')
  return app.getPath('appData')
})

ipcMain.handle('fgAllGames', async () => {
  console.log('fg all games')
  return await fg.getAllGames()
})

ipcMain.handle('fgGame', async (e, link) => {
  console.log('fg game: ' + link)
  return await fg.getGame(link)
})