import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import './DownloadBarBottom.css'

class DownloadBarBottom extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      progress: 0,
      downloadSpeed: 0,
      uploadSpeed: 0,
      totalItems: 0,
      expanded: false
    }

    let ipcRenderer = window.require('electron').ipcRenderer

    setInterval(async () => {
      const client = await ipcRenderer.invoke('getClientProgress')

      if (client) {
        this.setState({
          progress: client.progress,
          downloadSpeed: client.downloadSpeed,
          uploadSpeed: client.uploadSpeed,
          totalItems: client.items
        })
      }
    }, 500)
  }

  // Convert bytes to a better representation
  bytesToSize = (bytes) => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(2) + sizes[i] + '/s';
  }

  setExpanded = (cond) => {
    this.setState({expanded: cond})
  }

  render() {
    return (
      <div id="bottom-download-container"
      onMouseEnter={() => this.setExpanded(true)}
      /*onMouseLeave={() => this.setExpanded(false)}*/>
        <div id="bottom-download-progress" style={
          {
            width: `${this.state.progress * 100}%`
          }
        }>
          <p id="percentage">{`${(this.state.progress * 100).toFixed(2)}%`}</p>
        </div>
        <div id="speeds">
          <p id="downloadSpeed"><FontAwesomeIcon icon={faArrowDown}/> {this.bytesToSize(this.state.downloadSpeed)}</p>
          <p id="uploadSpeed"><FontAwesomeIcon icon={faArrowUp}/> {this.bytesToSize(this.state.uploadSpeed)}</p>
        </div>
      {this.state.expanded ? <div id="extra">Downloading {this.state.totalItems} items</div>:null}
      </div>
    )
  }
}

export default DownloadBarBottom