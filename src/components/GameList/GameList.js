import './GameList.css';
import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faSync, faSearch } from "@fortawesome/free-solid-svg-icons";
import GameListItem from './GameListItem'
import scraper from './Scraper'
let ipcRenderer

class GameList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {query: 'call', games: []}
    ipcRenderer = window.require('electron').ipcRenderer
  }

  componentDidMount = () => {
    ipcRenderer.invoke('getPath', 'appData').then(path => {
      scraper.setCache(window, path, ipcRenderer)
      this.getGames()
    })
  }

  handleSearch = (evt) => {
    this.setState({query: evt.target.value.toLowerCase()}, () => {
      this.getGames(this.state.query)
    })
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
    return games.map(g => <GameListItem key={g.link} name={g.name} link={g.link} />)
  }

  render() {
    return(
      <div id="list-root">
        <div id="topBar">
          <input placeholder="Search games..." type="text" onChange={this.handleSearch}></input>
          <FontAwesomeIcon icon={faSearch} />
          <button id="refresh" onClick={this.handleUpdate}><FontAwesomeIcon icon={faSync} /></button>
        </div>
        <div id="gameList">{this.renderGames()}</div>
      </div>
    )
  }
}

export default GameList