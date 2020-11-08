import React from 'react'
import './Game.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import DownloadPopup from '../Download/DownloadPopup'
import qs from 'qs'

const Scraper = require('../GameList/Scraper').default
let scraper

class Game extends React.Component {
  constructor(props) {
    super(props)

    let params = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })

    this.name = decodeURIComponent(params.name)
    this.mainLink = decodeURIComponent(params.link)

    this.state = {
      links: [],
      image: 'https://via.placeholder.com/200x300',
      description: '',
      popup: false,
      loaded: false
    }
  }

  componentDidMount = async () => {
    let ipcRenderer = window.require('electron').ipcRenderer
    let path = ipcRenderer.invoke('getPath', 'appData')
    
    scraper = new Scraper(window, path, ipcRenderer)
    await this.getLinks()
  }

  /**
   * Gets all links associated with game download (torrent and direct).
   */
  getLinks = async () => {
    const data = await scraper.getFitgirlGame(this.mainLink)
    this.setState({links: this.parseLinks(data.items), image: data.image, description: data.description, loaded: true})
  }

  /**
   * Output formatted links for each raw link.
   * 
   * @param {Array} links 
   */
  parseLinks = (links) => {
    let domLinks = []

    links.forEach(l => {
      l.links.forEach(internal => {
        let clickFunc
        if (internal.link.startsWith('magnet')) {
          clickFunc = this.doDownloadPopup
        }
        domLinks.push(<a onClick={clickFunc} key={internal.link} link={internal.link}>{internal.title}</a>)
      })
    })

    return domLinks
  }

  /**
   * Changes the current popup elements "top" attribute which makes it appear.
   * 
   * @param {Object} evt 
   */
  doDownloadPopup = (evt) => {
    const link = evt.target.getAttribute('link')
    this.setState({popup: true, curLink: link})
    this.forceUpdate()
  }

  /**
   * Back button.
   */
  goHome = () => {
    window.location.assign(window.location.origin + window.location.pathname + '#/')
  }

  render() {
    return(
      <div id="game-root">
        {this.state.popup ? <DownloadPopup magnet={this.state.curLink} closePopup={() => this.setState({popup: false})}/> : null}
        <button className="backButton" onClick={this.goHome}><FontAwesomeIcon icon={faArrowLeft}/></button>
        <div id="details">
          <img src={this.state.image} alt="Game Cover"/>
          <div id="game-description">
            <div><b>{this.name}</b>

            <div>{this.state.loaded ? this.state.description : <div className="loading"></div>}</div>
            </div>
          </div>
        </div>
        <div className="downloads">{this.state.links}</div>
      </div>
    )
  }
}

export default Game