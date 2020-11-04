import React from 'react'
import { slide as Menu } from 'react-burger-menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGamepad, faDownload, faCog } from '@fortawesome/free-solid-svg-icons'
import './Sidebar.css'

class Sidebar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      menuOpen: false
    }
  }

  handleStateChange = (state) => {
    this.setState({menuOpen: state.isOpen})  
  }

  closeMenu = () => {
    this.setState({menuOpen: false})
  }

  toggleMenu = () => {
    this.setState(state => ({menuOpen: !state.menuOpen}))
  }

  render() {
    return(
      <Menu
        isOpen={this.state.menuOpen}
        onStateChange={(state) => this.handleStateChange(state)}
      >
        <a href="#/" onClick={this.closeMenu}><FontAwesomeIcon icon={faGamepad} />Game List</a>
        <a href="#/downloads" onClick={this.closeMenu}><FontAwesomeIcon icon={faDownload} />Downloads</a>
        <a href="#/settings" onClick={this.closeMenu}><FontAwesomeIcon icon={faCog} />Settings</a>
      </Menu>
    )
  }
}

export default Sidebar