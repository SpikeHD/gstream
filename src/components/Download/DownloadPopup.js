import React from 'react'
import './DownloadPopup.css'
let ipcRenderer

class DownloadPopup extends React.Component {
  constructor(props) {
    super(props)

    console.log(props)

    this.magnet = props.magnet
    this.state = {defaultPath: '', path: ''}

    ipcRenderer = window.require('electron').ipcRenderer
  }

  setPath = async () => {
    ipcRenderer.invoke('getPath', 'home').then(path => {
      this.setState({defaultPath: path, path: path})
    })
  }

  startMagnetDownload = (magnet) => {
    ipcRenderer.invoke('startDownload', [magnet, this.state.path])
    window.location.assign('#/')
  }

  setDownloadDir = (evt) => {
    this.setState({path: evt.target.value})
  }

  render() {
    return (
      <div className="dlpopup" style={
        this.props.popup && !this.clicked ?
        {
          'top': '50%'
        }
          :
        {
          'top': '200%'
        }
      }>
        <div className="popup-section">
          Download Location:
          <input type="text" id="directory" ref={this.dirInput} onChange={this.setDownloadDir} placeholder="Path..." defaultValue={`C:/Users/Default/Downloads`}></input>
        </div>
        <div className="popup-section">
          <button onClick={() => this.startMagnetDownload(this.props.magnet)}>Start Download</button>
        </div>
      </div>
    )
  }
}

export default DownloadPopup