import React from 'react'
import './DownloadSection.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay, faTimes, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { bytesToSize } from './downloadUtil'
let ipcRenderer
let updateInterval

class DownloadSection extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {torrent: props.torrent, loaded: false, paused: false, setInitialPlay: false}

    ipcRenderer = window.require('electron').ipcRenderer

    updateInterval = setInterval(async () => {
      if (this.state.torrent.magnetURI) {
        const details = await ipcRenderer.invoke('getIndividualTorrentsDetails', this.state.torrent.magnetURI)
        this.setState({torrent: details, loaded: true})

        console.log(details.cache)

        if (details.downloadSpeed <= 0) this.setState({paused: true})
        else if (!this.setInitialPlay) this.setState({paused: false, setInitialPlay: true})
      }
    }, 500)
  }

  componentWillUnmount = () => {
    clearInterval(updateInterval)
  }

  stopTorrent = () => {
    ipcRenderer.invoke('destroyTorrent', this.state.torrent.magnetURI).then(removed => {
      if (removed) this.setState({paused: true, loaded: false})
    })
  }

  pauseTorrent = () => {
    ipcRenderer.invoke('pauseTorrent', this.state.torrent.magnetURI).then(paused => {
      if (paused) this.setState({paused: true})
    })
  }

  startTorrent = () => {
    ipcRenderer.invoke('resumeTorrent', this.state.torrent.magnetURI).then(resumed => {
      if (resumed) this.setState({paused: false, setInitialPlay: false})
    })
  }

  openFiles = () => {
    ipcRenderer.invoke('openInFiles', this.state.torrent.path)
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
              <span className={!this.state.setInitialPlay ? 'greyed':null}>
                {this.state.paused ? <FontAwesomeIcon icon={faPlay} onClick={!this.state.setInitialPlay ? null:this.startTorrent}/>:<FontAwesomeIcon icon={faPause} onClick={this.pauseTorrent} />}
              </span>
              <span>
                <FontAwesomeIcon icon={faTimes} onClick={this.stopTorrent} />
              </span>
              <span className="fileOpen" > 
                <button onClick={this.openFiles}><FontAwesomeIcon icon={faFolderOpen} /> Open in File Explorer</button>
              </span>
            </div>
          </div>
        </div>
      )
    } else return null
  }
}

export default DownloadSection