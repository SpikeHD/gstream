import React from 'react'
const placeholder = 'https://via.placeholder.com/350x200'
let ipcRenderer

class GameListItem extends React.Component {
  constructor(props) {
    super(props)

    this.name = props.name
    this.link = props.link
    this.renderedDOM = null

    ipcRenderer = window.require('electron').ipcRenderer

    this.state = {image: placeholder}
  }

  componentDidMount = () => {
    if (this.props.scrolling) {
      if (!this.isInvisible(this.renderedDOM)) {
        this.getImage()
      }
    }
  }

  isInvisible = (e) => {
    const rect = e.getBoundingClientRect()
    const vWidth = window.innerWidth || document.documentElement.clientWidth
    const vHeight = window.innerHeight || document.documentElement.clientWidth
    const efp = (x,y) => document.elementFromPoint(x, y)

    // Not in viewport
    if(rect.right < 0 ||
      rect.bottom < 0 ||
      rect.left > vWidth ||
      rect.top > vHeight) return false

    // If any corner is visible
    return (
      e.contains(efp(rect.left, rect.top))
        || e.contains(efp(rect.right, rect.top))
        || e.contains(efp(rect.right, rect.bottom))
        || e.contains(efp(rect.left, rect.bottom))
    )
  }

  getImage = async () => {
    try {
      const image = await ipcRenderer.invoke('getFitgirlImage', (this.link))
  
      this.setState({image: image})
    } catch(e) { console.log(e) }
  }

  getGame = () => {
    // Store link and name in URI params
    const escLink = encodeURIComponent(this.link)
    const escName = encodeURIComponent(this.name)
    window.location.assign(`#/game?link=${escLink}&name=${escName}`)
  }

  render() {
    return (
      <div ref={itm => this.renderedDOM = itm} onScroll={this.handleScroll} className="gameListItem" link={this.link} onClick={this.getGame}>
        <img src={this.state.image} alt="Game Screenshot" width="250"/>
        <p className="title">{this.name}</p>
      </div>
    )
  }
}

export default GameListItem