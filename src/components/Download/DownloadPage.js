import React from 'react'
import DownloadSection from './DownloadSection'
import './DownloadPage.css'
let ipcRenderer

class DownloadPage extends React.Component {
  constructor(props) {
    super(props)
    
    ipcRenderer = window.require('electron').ipcRenderer

    this.state = {
      torrents: []
    }

    setInterval(() => {
      this.getTorrentDetails()
    }, 500)
  }

  getTorrentDetails = async () => {
    const torrents = await ipcRenderer.invoke('getAllTorrentDetails')
    this.setState({torrents: torrents})
  }

  renderTorrents = () => {
    this.getTorrentDetails()

    return this.state.torrents.map(torrent => {
      return <DownloadSection key={torrent.magentURI} torrent={torrent} />
    })
  }

  render() {
    return(
      <div id="downloadPage">
        {this.renderTorrents()}
      </div>
    )
  }
}

export default DownloadPage