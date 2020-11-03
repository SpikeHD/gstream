import React from 'react'
import './DownloadSection.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay, faTimes } from "@fortawesome/free-solid-svg-icons";
import { bytesToSize } from './downloadUtil'
let ipcRenderer

class DownloadSection extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {torrent: props.torrent, loaded: false, paused: false}

    ipcRenderer = window.require('electron').ipcRenderer

    setInterval(async () => {
      if (this.state.torrent.magnetURI) {
        const details = await ipcRenderer.invoke('getIndividualTorrentsDetails', this.state.torrent.magnetURI)
        this.setState({torrent: details, loaded: true})
      }
    }, 500)
  }

  stopTorrent = () => {
    ipcRenderer.invoke('destroyTorrent', this.state.torrent.magnetURI)
  }

  pauseTorrent = () => {
    ipcRenderer.invoke('pauseTorrent', this.state.torrent.magnetURI).then(paused => {
      if (paused) this.setState({paused: true})
    })
  }

  startTorrent = () => {
    ipcRenderer.invoke('resumeTorrent', this.state.torrent.magnetURI).then(resumed => {
      if (resumed) this.setState({paused: false})
    })
  }

  render() {
    if(this.state.loaded) {
      return (
        <div>
          <div className="downloadSection">
            <span className="name">{this.state.torrent.name}</span>
            <span className="progress">{bytesToSize(this.state.torrent.totalDownloaded)}/{bytesToSize(this.state.torrent.size)}</span>
            <div className="progressBar">
              <div className="progressUnder" style={{
                'width': this.state.torrent.progress * 100 + '%'
              }}><span className="progressMessage">{this.state.paused ? "Paused":null}</span></div>
            </div>
            <div className="controls">
              <span>
                {this.state.paused ? <FontAwesomeIcon icon={faPlay} onClick={this.startTorrent}/>:<FontAwesomeIcon icon={faPause} onClick={this.pauseTorrent} />}
              </span>
              <span>
                <FontAwesomeIcon icon={faTimes} onClick={this.stopTorrent} />
              </span>
            </div>
          </div>
        </div>
      )
    } else return null
  }
}

export default DownloadSection