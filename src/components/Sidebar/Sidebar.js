import React from 'react'
import { slide as Menu } from 'react-burger-menu'
import './Sidebar.css'

class Sidebar extends React.Component {
  render() {
    return(
      <Menu>
        <a href="/">Game List</a>
        <a href="/downloads">Downloads</a>
        <a href="/settings">Settings</a>
      </Menu>
    )
  }
}

export default Sidebar