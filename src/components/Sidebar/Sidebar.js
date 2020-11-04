import React from 'react'
import { slide as Menu } from 'react-burger-menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGamepad, faDownload, faCog } from '@fortawesome/free-solid-svg-icons'
import './Sidebar.css'

class Sidebar extends React.Component {
  render() {
    return(
      <Menu>
        <a href="/"><FontAwesomeIcon icon={faGamepad} />Game List</a>
        <a href="/downloads"><FontAwesomeIcon icon={faDownload} />Downloads</a>
        <a href="/settings"><FontAwesomeIcon icon={faCog} />Settings</a>
      </Menu>
    )
  }
}

export default Sidebar