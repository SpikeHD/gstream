const WebTorrent = require('webtorrent')
const fs = require('fs')
const { app } = require('electron')
let client = new WebTorrent()

// As soon as we're imported, make sure there's a cache file
try {
  JSON.parse(fs.readFileSync(app.getPath('appData') + '/gstream/torrents.json'))
} catch (e) {
  fs.writeFileSync(app.getPath('appData') + '/gstream/torrents.json', '[]', 'utf-8')
}

/**
 * Start or resume a torrent download.
 * 
 * THe "inital" boolean will determine whether it is
 * the first time the torrent has begun downloading before
 * or not.
 * 
 * @param {String} magnet 
 * @param {String} path 
 * @param {Boolean} initial 
 */
exports.startDownload = async (magnet, path, initial = false) => {
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
    if (t.downloadSpeed <= 0 && !initial) {
      client = new WebTorrent()
      if(cache.length > 0) {
        cache.forEach(c => {
          this.startDownload(c.magnetURI, "")
        })
      }
    }
  }, 10000)
}

/**
 * Returns a formatted Object with client progress.
 */
exports.getClientProgress = async () => {
  return {
    progress: client.progress,
    downloadSpeed: client.downloadSpeed,
    uploadSpeed: client.uploadSpeed,
    items: client.torrents.length
  }
}

/**
 * Returns a formatted Array of details for each torrent.
 */
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

/**
 * Get details of one torrent. Uses cache and live.
 * 
 * @param {String} arg 
 */
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

/**
 * Pauses a torrent.
 * 
 * @param {String} arg 
 */
exports.pauseTorrent = async (arg) => {
  const t = client.torrents.find(t => t.magnetURI.includes(arg) || arg.includes(t.magnetURI) || t.name === arg)

  if (t) {
    // Make sure to write updated info to cache
    await this.updateCache(t)
    t.destroy({destroyStore: false})
    return true
  } else return false
}

/**
 * Resume a torrent.
 * 
 * @param {String} arg 
 */
exports.resumeTorrent = async (arg) => {
  const cache = this.readCache()
  const t = cache.find(t => t.magnetURI.includes(arg) || arg.includes(t.magnetURI) || t.name === arg)

  if (t) {
    await this.startDownload(t.magnetURI)
    return true
  } else return false
}

/**
 * Stop and remove local files of a torrent.
 * 
 * @param {String} arg 
 */
exports.destroyTorrent = async (arg) => {
  const t = client.torrents.find(t => t.magnetURI.includes(arg) || arg.includes(t.magnetURI) || t.name === arg)

  if (t) {
    await this.removeFromCache(t.magnetURI)
    t.destroy({destroyStore: true})
    return true
  } else return false
}

/** Caching. Used for storing destroyed torrents so they can be unpaused later, or to start torrents after the program has closed and reopened */

/**
 * Update local torrent cache with current torrent details.
 * 
 * @param {Object} torrent 
 */
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

/**
 * Inital write to cache of a torrent.
 * 
 * @param {Object} torrent 
 */
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

/**
 * Get torrent cache using magnet.
 * 
 * @param {String} magnet 
 */
exports.getFromCache = async (magnet) => {
  const current = await this.readCache()
  return current.find(t => t.magnetURI.includes(magnet))
}

/**
 * Removes a torrent from cache.
 * 
 * Should be done when removing from the client as well.
 * 
 * @param {String} magnet 
 */
exports.removeFromCache = async (magnet) => {
  const current = await this.readCache()
  const cacheInstance = current.find(t => magnet.includes(t.magnetURI))
  if (!cacheInstance) return false

  current.splice(current.indexOf(cacheInstance), 1)

  await fs.writeFileSync(app.getPath('appData') + '/gstream/torrents.json', JSON.stringify(current), 'utf-8')
}

/**
 * Shorthand for returning the entire cache file.
 */
exports.readCache = () => {
  return JSON.parse(fs.readFileSync(app.getPath('appData') + '/gstream/torrents.json'))
}