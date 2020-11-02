import React from 'react'
import './Game.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import scraper from '../GameList/Scraper'
import qs from 'qs'

class Game extends React.Component {
  constructor(props) {
    super(props)

    let params = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })

    this.name = decodeURIComponent(params.name)
    this.mainLink = decodeURIComponent(params.link)

    this.state = {links: [], image: 'https://via.placeholder.com/200x300'}
  }

  componentDidMount = async () => {
    let ipcRenderer = window.require('electron').ipcRenderer
    let path = ipcRenderer.invoke('getAppData')
    
    scraper.setCache(window, path, ipcRenderer)
    await this.getLinks()
  }

  getLinks = async () => {
    const data = await scraper.getFitgirlGame(this.mainLink)
    this.setState({links: this.parseLinks(data.items), image: data.image})
  }

  parseLinks = (links) => {
    let domLinks = []

    links.forEach(l => {
      l.links.forEach(internal => {
        domLinks.push(<a key={internal.link} href={internal.link}>{internal.title}</a>)
      })
    })

    return domLinks
  }

  goHome = () => {
    window.location.assign('/')
  }

  render() {
    return(
      <div id="game-root">
        <button className="backButton" onClick={this.goHome}><FontAwesomeIcon icon={faArrowLeft}/></button>
        <img src={this.state.image} alt="Game Cover"/>
        <div className="game-description">

        </div>
        <div className="downloads">{this.state.links}</div>
      </div>
    )
  }
}

export default Game