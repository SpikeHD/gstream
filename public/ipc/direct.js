const axios = require('axios')
const progress = require('progress-stream')

class Client {
  constructor() {
    this.downloads = []
  }

  startDownload = async (link, folder, opts) => {
    const str = progress({
      time: 1000
    })
    const res = await axios.get(link, opts)
    const name = res.data.headers['content-disposition']
    this.downloads.push({
      name: name,
      stream: res.data.pipe(str).pipe(fs.createWriteStream(folder + '/' + name))
    })
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
    
    // Kill write stream
    dl.stream.destroy()

    // Remove from array
    this.downloads.splice(index, 1)
  }
}

exports = Client