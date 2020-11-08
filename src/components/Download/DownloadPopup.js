import React from 'react'
import './DownloadPopup.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faTimes } from "@fortawesome/free-solid-svg-icons";
let ipcRenderer

class DownloadPopup extends React.Component {
  constructor(props) {
    super(props)

    this.magnet = props.magnet
    this.state = {path: ''}

    ipcRenderer = window.require('electron').ipcRenderer
  }

  componentDidMount = () => {
    this.setState({path: this.makeDefaultPath()})
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
   * Send torrent link to main process for download.
   * 
   * @param {String} magnet 
   */
  startMagnetDownload = (magnet) => {
    ipcRenderer.invoke('startDownload', [magnet, this.state.path])
    this.props.closePopup()
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
    if (!path || path.length <= 0) return

    if (typeof(path) === 'array') path = path[0]

    this.setState({path: path})
    this.forceUpdate()
  }

  openProtonHelp = () => {
    const link = 'https://www.reddit.com/r/Steam/comments/99fjzw/steam_proton_for_non_steam_applications/'
    window.require('electron').shell.openExternal(link)
  }

  render() {
    return (
      <div className="dlpopup">
        <button className="popupClose" onClick={() => {
          // Update parent state to remove popup
          this.props.closePopup()
        }}><FontAwesomeIcon icon={faTimes} /></button>
        <div className="popup-section">
          Download Location:
          <input type="text" id="directory" ref={this.dirInput} onChange={this.setDownloadDir} placeholder="Path..." value={this.state.path}></input>
          <button className="browseButton" onClick={this.handleDirSelect}><FontAwesomeIcon icon={faFolderOpen} /> Browse...</button>
          {this.makeDefaultPath().startsWith('/') ? <div className="red">
            Hey! I noticed you aren't using Windows! I'm sure you may already know how to get you program running, but in case you don't, take a look at <a target="_blank" onClick={this.openProtonHelp}>this!</a>
          </div> : null}
        </div>
        <div className="popup-section">
          <button className={this.state.path.length > 0 ? null:'greyed-out'} onClick={() => this.state.path.length > 0 ? this.startMagnetDownload(this.props.magnet) : null}>Start Download</button>
        </div>
      </div>
    )
  }
}

export default DownloadPopup