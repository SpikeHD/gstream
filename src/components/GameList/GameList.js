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

    this.state = {query: '', games: []}
    ipcRenderer = window.require('electron').ipcRenderer
  }

  componentDidMount = () => {
    // When the list is loaded, create an instance of our scraper
    // that will write to cache
    ipcRenderer.invoke('getCachePath').then(path => {
      console.log(path)
      scraper = new Scraper(window, path, ipcRenderer)
      this.getGames()
    })
  }

  /**
   * Handles typing in the search bar.
   * 
   * @param {Object} evt 
   */
  handleSearch = (evt) => {
    this.setState({query: evt.target.value.toLowerCase()}, () => {
      this.getGames(this.state.query)
    })

    // Required to render the new list
    this.forceUpdate()
  }

  /**
   * Handles a manual refresh.
   */
  handleUpdate = () => {
    scraper.getGames().then(games => {
      this.setState({games: games})
    })
  }

  /**
   * Get game cache and filter the results by a query.
   * 
   * @param {String} query 
   */
  getGames = async (query) => {
    let arr = await scraper.getGameCache()
    if (query && query.length > 0) {
      arr = arr.filter(g => g.name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').includes(query))
    }
    this.setState({games: arr})
  }

  /**
   * Create an array of GameListItem components with game list data.
   */
  renderGames = () => {
    const games = this.state.games
    const map = games.map(g => <GameListItem key={g.link} name={g.name} link={g.link} />)
    
    if (map.length > 0) return map
    else {
      return(
        <div className="loading"></div>
      )
    }
  }

  render() {
    return(
      <div id="list-root">
        <div id="topBar">
          <input placeholder="Search games..." type="text" onChange={this.handleSearch}></input>
          <FontAwesomeIcon icon={faSearch} />
          <button id="refresh" onClick={this.handleUpdate}><FontAwesomeIcon icon={faSync} /></button>
        </div>
        <div rel={itm => this.DOMlist = itm} id="gameList">{this.renderGames()}</div>
      </div>
    )
  }
}

export default GameList