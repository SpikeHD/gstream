import React from 'react'
import './Game.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
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

  componentDidMount() {
    this.getLinks().then(() => this.parseLinks())
  }

  getLinks = async () => {
    const data = await scraper.getFirgirlGame(this.mainLink)
    this.links = data
  }

  parseLinks = () => {
    let links = []

    console.log(this.links.items)

    this.links.items.forEach(l => {
      l.links.forEach(internal => {
        links.push(<a href={internal.link}>{internal.title}</a>)
      })
    })

    this.setState({links: links})
  }

  goHome = () => {
    window.location.assign('/')
  }

  render() {
    return(
      <div id="game-root">
        <button className="backButton" onClick={this.goHome}><FontAwesomeIcon icon={faArrowLeft}/></button>
        <img src={this.state.image}/>
        <div className="game-description">

        </div>
        <div className="downloads">{this.state.links}</div>
      </div>
    )
  }
}

export default Game