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

    this.interval = setInterval(() => {
      this.getTorrentDetails()
    }, 500)
  }

  componentWillUnmount = () => {
    clearInterval(this.interval)
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
        <span className="torrentSize">
          Currently downloading {this.state.torrents.length} torrent(s). {this.state.torrents.length <= 0 ? 'Head to the Game List to start downloading some!':null}
        </span>
        {this.renderTorrents()}
      </div>
    )
  }
}

export default DownloadPage