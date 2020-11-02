import './GameList.css';
import React from 'react'
import GameListItem from './GameListItem'
import scraper from './Scraper'

class GameList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {games: []}
  }

  componentDidMount = async () => {
    const ipcRenderer = window.require('electron').ipcRenderer
    ipcRenderer.invoke('getAppData').then(path => {
      scraper.setCache(window, path, ipcRenderer)
      this.parseFitgirl(scraper.getCacheFitgirl())
    })
  }

  parseFitgirl = async (games) => {
    await games
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
        <button onClick={this.parseFitgirl(scraper.getFitgirl())}>Update/Refresh</button>
        <div id="gameList">{this.state.games}</div>
      </div>
    )
  }
}

export default GameList