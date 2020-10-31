import './GameList.css';
import React from 'react'
import scraper from "./Scraper"

class GameList extends React.Component {
  constructor(props) {
    super(props)
  }

  async getFitgirl() {
    const res = await scraper.getFitgirl()
    console.log(res.data)
  }

  render() {
    return(
      <button onClick={this.getFitgirl}>Press Me!</button>
    )
  }
}

export default GameList