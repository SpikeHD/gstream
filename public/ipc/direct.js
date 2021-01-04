const axios = require('axios')
const fs = require('fs')
class Client {
  constructor() {
    this.downloads = []
  }

  startDownload = async (link, folder, opts = {}) => {
    // Option requirements
    opts.responseType = 'stream'
    opts.headers = {
      'connection': 'keep-alive',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0'
    }

    link = link.replace('////', '//')
    console.log(link)
    const res = await axios.get(link.replace(/\/\/\/\//g, '//'), opts)
    const name = res.data.headers['content-disposition']
    const size = res.data.headers['content-length']
    console.log(res.data.headers)
    const wStream = fs.createWriteStream(folder + '/' + name)

    res.data.pipe(wStream)

    res.data.on('data', (chunk) => {
      this.downloadProgress(name, chunk.length)
    })

    this.downloads.push({
      name,
      data: res.data,
      stream: wStream,
      size,
      progress: 0
    })
  }

  downloadProgress = (name, progress) => {
    const dl = this.getDownload(name)
    const index = this.downloads.indexOf(dl)

    dl.progress += progress

    this.downloads[index] = dl

    console.log(`Progress! ${dl.progress}/${dl.size}`)
  }

  getDownloads = () => {
    return this.downloads
  }

  getDownload = (name) => {
    return this.downloads.find(d => d.name === name)
  }

  stopDownload = (name) => {
    const dl = this.getDownload(name)
    const index = this.downloads.indexOf(dl)
  }
}

module.exports = Client