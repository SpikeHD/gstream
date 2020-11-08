import './GameList.css';
import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faSync, faSearch } from "@fortawesome/free-solid-svg-icons";
import GameListItem from './GameListItem'
const Scraper = require('./Scraper').default
let scraper
let ipcRenderer

class GameList extends React.Component {
  constructor(props) {
    super(props)

    this.scrolling = false

    this.state = {query: 'call', games: []}
    ipcRenderer = window.require('electron').ipcRenderer

    setInterval(() => {
      if (this.scrolling) this.scrolling = false
    }, 100)
  }

  componentDidMount = () => {
    ipcRenderer.invoke('getPath', 'appData').then(path => {
      scraper = new Scraper(window, path, ipcRenderer)
      this.getGames()
    })

    window.addEventListener('scroll', this.handleScroll())
  }

  handleSearch = (evt) => {
    this.setState({query: evt.target.value.toLowerCase()}, () => {
      this.getGames(this.state.query)
    })

    this.forceUpdate()
  }

  handleUpdate = () => {
    scraper.getFitgirl().then(fg => {
      this.setState({games: fg})
    })
  }

  getGames = async (query) => {
    let arr = await scraper.getCacheFitgirl()
    if (query && query.length > 0) {
      arr = arr.filter(g => g.name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').includes(query))
    }
    this.setState({games: arr})
  }

  renderGames = () => {
    const games = this.state.games
    const map = games.map(g => <GameListItem key={g.link} name={g.name} link={g.link} scrolling={this.scrolling} />)
    
    if (map.length > 0) return map
    else {
      return(
        <div className="loading"></div>
      )
    }
  }

  handleScroll = () => {
    this.scrolling = true
    this.forceUpdate()
  }

  render() {
    return(
      <div id="list-root">
        <div id="topBar">
          <input placeholder="Search games..." type="text" onChange={this.handleSearch}></input>
          <FontAwesomeIcon icon={faSearch} />
          <button id="refresh" onClick={this.handleUpdate}><FontAwesomeIcon icon={faSync} /></button>
        </div>
        <div rel={itm => this.DOMlist = itm} id="gameList" onScroll={this.handleScroll}>{this.renderGames()}</div>
      </div>
    )
  }
}

export default GameList