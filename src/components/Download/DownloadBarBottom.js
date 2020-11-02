import React from 'react'
import './DownloadBarBottom.css'

class DownloadBarBottom extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      progress: 0,
      downloadSpeed: 0,
      uploadSpeed: 0
    }

    let ipcRenderer = window.require('electron').ipcRenderer

    setInterval(async () => {
      const client = await ipcRenderer.invoke('getClientProgress')

      if (client) {
        this.setState({
          progress: client.progress,
          downloadSpeed: client.downloadSpeed,
          uploadSpeed: client.uploadSpeed
        })
      }

      console.log(this.state)
    }, 500)
  }

  bytesToSize = (bytes) => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i] + '/s';
  }

  render() {
    return (
      <div id="bottom-download-container">
        <div id="bottom-download-progress" style={
          {
            width: `${this.state.progress * 100}%`
          }
        }>
          <p>{`${(this.state.progress * 100).toFixed(2)}%`}</p>
        </div>
          <p>{`Down: ${this.bytesToSize(this.state.downloadSpeed)}`}</p>
          <p>{`Up: ${this.bytesToSize(this.state.uploadSpeed)}`}</p>
      </div>
    )
  }
}

export default DownloadBarBottom