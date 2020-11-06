import React from 'react'
import { slide as Menu } from 'react-burger-menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGamepad, faDownload, faCog } from '@fortawesome/free-solid-svg-icons'
import './Sidebar.css'

class Sidebar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      menuOpen: false,
      basePath: props.basePath
    }
  }

  handleStateChange = (state) => {
    this.setState({menuOpen: state.isOpen})  
  }

  closeMenu = (evt) => {
    this.setState({menuOpen: false})
    this.goto(evt.target.getAttribute('link'))
  }

  toggleMenu = () => {
    this.setState(state => ({menuOpen: !state.menuOpen}))
  }

  goto = (url) => {
    window.location.assign(url)
  }

  render() {
    return(
      <Menu
        isOpen={this.state.menuOpen}
        onStateChange={(state) => this.handleStateChange(state)}
      >
        <a link={'#/'} onClick={this.closeMenu}><FontAwesomeIcon icon={faGamepad} />Game List</a>
        <a link={'#/downloads'} onClick={this.closeMenu}><FontAwesomeIcon icon={faDownload} />Downloads</a>
        <a link={'#/settings'} onClick={this.closeMenu}><FontAwesomeIcon icon={faCog} />Settings</a>
      </Menu>
    )
  }
}

export default Sidebar