const WebTorrent = require('webtorrent')
const fs = require('fs')
const { app } = require('electron')
const client = new WebTorrent()

exports.startDownload = async (magnet, path) => {
  return await client.add(magnet, {
    path: path,
  })
}

exports.getClientProgress = async () => {
  return {
    progress: client.progress,
    downloadSpeed: client.downloadSpeed,
    uploadSpeed: client.uploadSpeed,
    items: client.torrents.length
  }
}

exports.getAllTorrentsDetails = async () => {
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
}

exports.getIndividualTorrentsDetails = async (arg) => {
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
}

exports.startMagnet = async (args) => {
  const magnet = args[0]
  const path = args[1]

  if (client.torrents.find(t => t.magnetURI.includes(args[0]))) return

  const t = await this.startDownload(magnet, path)

  // When finished, remove from cache
  t.on('done', async() => {
  })

  return {
    timeLeft: t.timeRemaining,
    name: t.name
  }
}

exports.pauseTorrent = async (arg) => {
  const t = client.torrents.find(t => t.magnetURI.includes(arg) || t.name === arg)

  if (t) {
    t.pause()
    return true
  } else return false
}

exports.resumeTorrent = async (arg) => {
  const t = client.torrents.find(t => t.magnetURI.includes(arg) || t.name === arg)

  if (t) {
    t.add(t.magnetURI)
    return true
  } else return false
}

exports.destroyTorrent = async (arg) => {
  const t = client.torrents.find(t => t.magnetURI.includes(arg) || t.name === arg)

  if (t) {
    t.destroy()
    return true
  } else return false
}

/** Caching. Used for storing destroyed torrents so they can be unpaused later, or to start torrents after the program has closed and reopened */

exports.writeToCache = async (magnet, path) => {
  const current = await this.readCache()
  if (current.find(t => t.magnetURI.includes(magnet))) return false

  current.push({
    magnetURI: magnet,
    path: path
  })

  fs.writeFileSync(app.getPath('appData') + '/gstream/torrents.json', JSON.stringify(current), 'utf-8')

  return true
}

exports.getFromCache = async (magnet) => {
  const current = await this.readCache()
  return current.find(t => t.magnetURI.includes(magnet))
}

exports.removeFromCache = async (magnet) => {
  const current = await this.readCache()
  const cacheInstance = current.find(t => t.magnetURI.includes(magnet))
  if (!cacheInstance) return false

  current.splice(current.indexOf(cacheInstance), 1)

  fs.readFileSync(app.getPath('appData') + '/gstream/torrents.json', JSON.stringify(current), 'utf-8')
}

exports.readCache = async () => {
  return JSON.parse(fs.readFileSync(app.getPath('appData') + '/gstream/torrents.json'))
}