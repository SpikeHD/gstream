const WebTorrent = require('webtorrent')
const fs = require('fs')
const { app } = require('electron')
const client = new WebTorrent()

try {
  JSON.parse(fs.readFileSync(app.getPath('appData') + '/gstream/torrents.json'))
} catch (e) {
  fs.writeFileSync(app.getPath('appData') + '/gstream/torrents.json', '[]', 'utf-8')
}

exports.startDownload = async (magnet, path) => {
  const cache = this.readCache()

  const t = await client.add(magnet, {
    path: path,
  })

  t.on('done', () => {
    this.removeFromCache(t.magnetURI)
  })

  if (!cache.find(t => t.magnetURI.includes(magnet))) this.writeToCache(t)

  return t
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
  let cached = this.readCache()
  let list = client.torrents.map(t => {
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

  if (cached) {
    cached = cached.filter(c => !list.includes(l => l.name === c.name))

    list = list.concat(cached)
  }

  return list
}

exports.getIndividualTorrentsDetails = async (arg) => {
  const t = client.torrents.find(t => t.magnetURI.includes(arg) || t.name === arg)
  const cached = await this.getFromCache(arg)
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
  } else if (cached) {
    return cached
  }
}

exports.startMagnet = async (args) => {
  const magnet = args[0]
  const path = args[1]

  if (client.torrents.find(t => t.magnetURI.includes(args[0]))) return

  const t = await this.startDownload(magnet, path)

  return {
    timeLeft: t.timeRemaining,
    name: t.name
  }
}

exports.pauseTorrent = async (arg) => {
  const t = client.torrents.find(t => t.magnetURI.includes(arg) || t.name === arg)

  if (t) {
    // Make sure to write updated info to cache
    t.destroy({destroyStore: false})
    return true
  } else return false
}

exports.resumeTorrent = async (arg) => {
  const t = client.torrents.find(t => t.magnetURI.includes(arg) || t.name === arg)

  if (t) {
    client.add(t.magnetURI)
    return true
  } else return false
}

exports.destroyTorrent = async (arg) => {
  const t = client.torrents.find(t => t.magnetURI.includes(arg) || t.name === arg)

  if (t) {
    t.destroy({destroyStore: true})
    return true
  } else return false
}

/** Caching. Used for storing destroyed torrents so they can be unpaused later, or to start torrents after the program has closed and reopened */

exports.updateCache = async (torrent) => {
  const current = await this.readCache()
  const found = current.find(t => t.magnetURI.includes(torrent.magnetURI) || torrent.magnetURI.includes(t.magnetURI))

  if (found) {
    current[current.indexOf(found)] = {
      path: torrent.path,
      name: torrent.name,
      downloadSpeed: 0,
      totalDownloaded: torrent.downloaded,
      uploadSpeed: 0,
      totalUploaded: torrent.uploaded,
      timeRemaining: 0,
      size: torrent.pieceLength + torrent.lastPieceLength,
      magnetURI: torrent.magnetURI
    }
  }

  console.log(current)

  fs.writeFileSync(app.getPath('appData') + '/gstream/torrents.json', JSON.stringify(current), 'utf-8')

  return true
}

exports.writeToCache = async (torrent) => {
  const current = await this.readCache()
  if (current.find(t => t.magnetURI.includes(torrent.magnet))) return false

  current.push({
    path: torrent.path,
    name: torrent.name,
    downloadSpeed: 0,
    totalDownloaded: torrent.downloaded,
    uploadSpeed: 0,
    totalUploaded: torrent.uploaded,
    timeRemaining: 0,
    size: torrent.pieceLength + torrent.lastPieceLength,
    magnetURI: torrent.magnetURI
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

exports.readCache = () => {
  return JSON.parse(fs.readFileSync(app.getPath('appData') + '/gstream/torrents.json'))
}