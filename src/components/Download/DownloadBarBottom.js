import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { bytesToSize } from './downloadUtil'
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
          <p id="downloadSpeed"><FontAwesomeIcon icon={faArrowDown}/> {bytesToSize(this.state.downloadSpeed)}/s</p>
          <p id="uploadSpeed"><FontAwesomeIcon icon={faArrowUp}/> {bytesToSize(this.state.uploadSpeed)}/s</p>
        </div>
      {this.state.expanded ? <div id="extra">Downloading {this.state.totalItems} items</div>:null}
      </div>
    )
  }
}

export default DownloadBarBottom