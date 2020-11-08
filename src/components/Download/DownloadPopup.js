import React from 'react'
import './DownloadPopup.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
let ipcRenderer

class DownloadPopup extends React.Component {
  constructor(props) {
    super(props)

    this.magnet = props.magnet
    this.clicked = false
    this.state = {defaultPath: '', path: ''}

    ipcRenderer = window.require('electron').ipcRenderer
  }

  componentDidMount = () => {
    this.setState({defaultPath: this.makeDefaultPath()})
  }

  /**
   * Make a default file path based on platform
   */
  makeDefaultPath = () => {
    const platform = ipcRenderer.invoke('getPlatform')
    const username = window.require('os').userInfo().username
    let str

    switch (platform) {
      case 'darwin':
         str = `/Users/${username}/Downloads`
        break
      case 'win32':
        str = `C:/Users/${username}/Downloads`
        break
      default:
        str = `/home/${username}/Downloads`
    }

    return str
  }

  /**
   * Set download path.
   */
  setPath = async () => {
    ipcRenderer.invoke('getPath', 'home').then(path => {
      this.setState({defaultPath: path, path: path})
    })
  }

  /**
   * Send torrent link to main process for download.
   * 
   * @param {String} magnet 
   */
  startMagnetDownload = (magnet) => {
    ipcRenderer.invoke('startDownload', [magnet, this.state.path])
    this.clicked = true
    this.forceUpdate()
  }

  /**
   * Set new download path.
   * 
   * @param {Object} evt 
   */
  setDownloadDir = (evt) => {
    this.setState({path: evt.target.value})
  }

  /**
   * Handles and sets state for dir s
   */
  handleDirSelect = async () => {
    let path = await ipcRenderer.invoke('openDirSelect')
    if (!path || path.length >= 0) return
    this.setState({defaultPath: path, path: path})
    this.forceUpdate()
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
          <input type="text" id="directory" ref={this.dirInput} onChange={this.setDownloadDir} placeholder="Path..." defaultValue={this.state.defaultPath}></input>
          <button className="browseButton" onClick={this.handleDirSelect}><FontAwesomeIcon icon={faFolderOpen} /> Browse...</button>
        </div>
        <div className="popup-section">
          <button onClick={() => this.startMagnetDownload(this.props.magnet)}>Start Download</button>
        </div>
      </div>
    )
  }
}

export default DownloadPopup