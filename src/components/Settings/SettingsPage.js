import React from 'react'
import './SettingsPage.css'
let ipcRenderer

class SettingsPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      modules: [],
      settings: {}
    }

    ipcRenderer = window.require('electron').ipcRenderer
  }

  componentDidMount = async () => {
    const list = await ipcRenderer.invoke('getModuleList')
    const settings = await this.getCurrentSettings()
    this.setState({modules: list, settings: settings})
  }

  renderModuleOptions = () => {
    const DOMlist = this.state.modules.map(i => <option value={i.filename}>{i.name}</option>)
    return DOMlist
  }

  getCurrentSettings = async () => {
    return await ipcRenderer.invoke('getSettings')
  }

  handleSettingsChange = (field, value) => {
    ipcRenderer.invoke('setSetting', [field, value])
  }

  render() {
    return(
      <div id="settingsPage">
        <div className="settingsSection">
          <span className="right">
            <div>
              <select selected={this.state.settings.module} onChange={
                (evt) => {
                  const val = evt.target.value
                  this.handleSettingsChange('module', val)
                }
              }>
                {this.renderModuleOptions()}
              </select>
            </div>
          </span>
          <span className="left">
            <div>Selected game list module:</div>
          </span>
        </div>
        <div className="settingsSection">
          <span className="right">
            <div>
              <input type="text" onChange={
                (evt) => {
                  const val = evt.target.value
                  this.handleSettingsChange('site', val)
                }
              } defaultValue={this.state.settings.site}></input>
            </div>
          </span>
          <span className="left">
            <div>Site to scrape: </div>
          </span>
        </div>
      </div>
    )
  }
}

export default SettingsPage