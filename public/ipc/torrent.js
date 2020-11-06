const WebTorrent = require('webtorrent')
const fs = require('fs')
const { app } = require('electron')
let client = new WebTorrent()

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

  t.on('metadata', () => {
    // In case it hasn't started already
    t.resume()
    if (!cache.find(t => t.magnetURI.includes(magnet))) this.writeToCache(t)
  })

  // Shitty workaround for now. When a torrent is re-added to the Client, it may not start downloading, so we recreate it.
  // This unfortunately refreshes both torrents
  setTimeout(() => {
    if (t.downloadSpeed <= 0) {
      client = new WebTorrent()
      if(cache.length > 0) {
        cache.forEach(c => {
          this.startDownload(c.magnetURI, "")
        })
      }
    }
  }, 10000)
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
    cached = cached.filter(c => list.indexOf(list.find(l => l.magnetURI.includes(c.magnetURI) || c.magnetURI.includes(l.magnetURI))) === -1)
    list = list.concat(cached)
  }

  return list
}

exports.getIndividualTorrentsDetails = async (arg) => {
  const t = client.torrents.find(t => t.magnetURI.includes(arg) || arg.includes(t.magnetURI) || t.name === arg)
  const cached = await this.getFromCache(arg)

  if (t) {
    return {
      name: t.name,
      path: t.path,
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
    // Mark as cache for debugging
    cached.cache = true
    return cached
  }
}

exports.pauseTorrent = async (arg) => {
  const t = client.torrents.find(t => t.magnetURI.includes(arg) || arg.includes(t.magnetURI) || t.name === arg)

  if (t) {
    // Make sure to write updated info to cache
    await this.updateCache(t)
    t.destroy({destroyStore: false})
    return true
  } else return false
}

exports.resumeTorrent = async (arg) => {
  const cache = this.readCache()
  const t = cache.find(t => t.magnetURI.includes(arg) || arg.includes(t.magnetURI) || t.name === arg)

  if (t) {
    await this.startDownload(t.magnetURI)
    return true
  } else return false
}

exports.destroyTorrent = async (arg) => {
  const t = client.torrents.find(t => t.magnetURI.includes(arg) || arg.includes(t.magnetURI) || t.name === arg)

  if (t) {
    await this.removeFromCache(t.magnetURI)
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
  const cacheInstance = current.find(t => magnet.includes(t.magnetURI))
  if (!cacheInstance) return false

  current.splice(current.indexOf(cacheInstance), 1)

  await fs.writeFileSync(app.getPath('appData') + '/gstream/torrents.json', JSON.stringify(current), 'utf-8')
}

exports.readCache = () => {
  return JSON.parse(fs.readFileSync(app.getPath('appData') + '/gstream/torrents.json'))
}