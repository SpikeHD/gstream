import React from 'react'
import ModuleDropdown from '../General/ModuleDropdown'
import './SettingsPage.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
let ipcRenderer

class SettingsPage extends React.Component {
  constructor(props) {
    super(props)

    this.moduleChanged = false

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

  getCurrentSettings = async () => {
    return await ipcRenderer.invoke('getSettings')
  }

  handleSettingsChange = (field, value) => {
    ipcRenderer.invoke('setSetting', [field, value])

    if (field === 'module') this.moduleChanged = true
    this.forceUpdate()
  }

  render() {
    return(
      <div id="settingsPage">
        <div className="settingsSection">
          <div style={{display: 'block', width: '100%', height: '40px'}}>
          <span className="right">
            <div>
              {this.state.modules.length > 0 ? 
                <ModuleDropdown options={this.state.modules} defaultValue={this.state.settings.module} onSelect={(val) => this.handleSettingsChange('module', val)} /> : null
              }
            </div>
          </span>
          <span className="left">
            <div>Selected game list module:</div>
          </span>
          </div>
          {this.moduleChanged ? 
            <p className="red"><FontAwesomeIcon icon={faInfoCircle} /> Changing the current module requires a restart</p> : null
          }
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