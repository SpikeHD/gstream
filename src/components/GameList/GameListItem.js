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
    setInterval(() => {
      if (this.state.image === placeholder && this.isVisible(this.renderedDOM)) {
        this.getImage()
      }
    }, 1000)
  }

  isVisible = (e) => {
    const top = e.getBoundingClientRect().top
    return top >= 0 && top <= window.innerHeight;
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