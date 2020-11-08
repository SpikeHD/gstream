import React from 'react'
const placeholder = 'https://via.placeholder.com/350x200'
let ipcRenderer

class GameListItem extends React.Component {
  constructor(props) {
    super(props)

    this.name = props.name
    this.link = props.link
    this.interval = null
    this.renderedDOM = null

    ipcRenderer = window.require('electron').ipcRenderer

    // Set the image as a placeholder until it loads
    this.state = {image: placeholder}
  }

  componentDidMount = () => {
    // Routinely check if the element is visible. If it is, load it's image
    this.interval = setInterval(async () => {
      if (this.state.image === placeholder && this.isVisible(this.renderedDOM)) {
        await this.getImage()
      }
    }, 500)
  }

  componentWillUnmount = () => {
    // Clear the interval if we aren't being rendered
    clearInterval(this.interval)
  }

  /**
   * Check if DOM element is viewable.
   * 
   * @param {DOMElement} e 
   */
  isVisible = (e) => {
    const top = e.getBoundingClientRect().top
    return top >= 0 && top <= window.innerHeight;
  }

  /**
   * Get the image for the current game.
   */
  getImage = async () => {
    try {
      const image = await ipcRenderer.invoke('getImage', (this.link))
      this.setState({image: image})
    } catch(e) { console.log(e) }
  }

  /**
   * Redirects to game page.
   */
  getGame = () => {
    // Store link and name in URI params
    const escLink = encodeURIComponent(this.link)
    const escName = encodeURIComponent(this.name)
    window.location.assign(`#/game?link=${escLink}&name=${escName}`)
  }

  render() {
    return (
      <div ref={itm => this.renderedDOM = itm} className="gameListItem" link={this.link} onClick={this.getGame}>
        <img src={this.state.image} alt="Game Screenshot" width="250"/>
        <p className="title">{this.name}</p>
      </div>
    )
  }
}

export default GameListItem