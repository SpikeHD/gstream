import './GameList.css';
import React from 'react'
import GameListItem from './GameListItem'
import scraper from "./Scraper"

class GameList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {games: []}
  }

  parseFitgirl = async () => {
    const games = await scraper.getFitgirl()
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
        <button onClick={this.parseFitgirl}>Press Me!</button>
        <div id="gameList">{this.state.games}</div>
      </div>
    )
  }
}

export default GameList