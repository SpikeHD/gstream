const WebTorrent = require('webtorrent')
const client = new WebTorrent()

exports.startDownload = async (magnet, path) => {
  return await client.add(magnet, {
    path: path,
  })
}

exports.getClient = async () => {
  return client
}