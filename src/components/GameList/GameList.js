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

    this.state = {gameList: [], games: [], query: ''}
    ipcRenderer = window.require('electron').ipcRenderer
  }

  componentDidMount = async () => {
    const path = await ipcRenderer.invoke('getAppData')
    scraper.setCache(window, path, ipcRenderer)
    this.setState({games: await scraper.getCacheFitgirl()})
    this.updateGames()
  }

  handleUpdate = async () => {
    this.setState({games: await scraper.getFitgirl()})
  }

  handleSearch = (evt) => {
    const elm = evt.target
    const query = elm.value

    this.updateGames(query)
  }

  updateGames = (query = '') => {
    const games = this.state.games
    let list = []

    query = query.toLowerCase()
    
    games.forEach(g => {
      list.push(
        <GameListItem name={g.name} link={g.link}/>
      )
    })

    this.setState({gameList: list})
  }

  render() {
    return(
      <div id="list-root">
        <div id="topBar">
          <input type="text" onChange={this.handleSearch}></input>
          <FontAwesomeIcon icon={faSearch} />
          <button id="refresh" onClick={this.handleUpdate}><FontAwesomeIcon icon={faSync} /></button>
        </div>
        <div id="gameList">{this.state.gameList}</div>
      </div>
    )
  }
}

export default GameList