import './GameList.css';
import React from 'react'
import GameListItem from './GameListItem'
import scraper from './Scraper'
let ipcRenderer

class GameList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {games: []}
    ipcRenderer = window.require('electron').ipcRenderer
  }

  componentDidMount = async () => {
    const path = await ipcRenderer.invoke('getAppData')
    scraper.setCache(window, path, ipcRenderer)
    this.parseFitgirl(await scraper.getCacheFitgirl())
  }

  handleUpdate = async () => {
    return this.parseFitgirl(await scraper.getFitgirl())
  }

  parseFitgirl = async (games) => {
    let list = []
    
    games.forEach(g => {
      list.push(
        <GameListItem name={g.name} link={g.link}/>
      )
    })

    this.setState({games: list})
  }

  render() {
    return(
      <div id="list-root">
        <button onClick={this.handleUpdate}>Update/Refresh</button>
        <input type="text"></input>
        <div id="gameList">{this.state.games}</div>
      </div>
    )
  }
}

export default GameList