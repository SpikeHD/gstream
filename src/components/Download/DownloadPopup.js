import React from 'react'
import './DownloadPopup.css'

class DownloadPopup extends React.Component {
  constructor(props) {
    super(props)

    this.magnet = props.magnet
    this.state = {defaultPath: '', path: ''}
  }

  setPath = async () => {
    window.require('electron').ipcRenderer.invoke('getPath', 'home').then(path => {
      this.setState({defaultPath: path, path: path})
    })
  }

  startMagnetDownload = () => {
    window.require('electron').ipcRenderer.invoke('startMagnet', [this.magnet, this.state.path])
    this.show = false
  }

  setDownloadDir = (evt) => {
    this.setState({path: evt.target.value})
  }

  render() {
    return(
      <div className="dlpopup">
        <div className="popup-section">
          Download Location:
          <input type="text" id="directory" ref={this.dirInput} onChange={this.setDownloadDir} placeholder="Path..." defaultValue={`C:/Users/Default/Downloads`}></input>
        </div>
        <div className="popup-section">
          <button onClick={this.startMagnetDownload}>Start Download</button>
        </div>
      </div>
    )
  }
}

export default DownloadPopup