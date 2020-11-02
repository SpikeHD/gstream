import React from 'react'
import Rawger from 'rawger'

class GameListItem extends React.Component {
  constructor(props) {
    super(props)

    this.name = props.name
    this.link = props.link

    this.state = {image: 'https://via.placeholder.com/250x150'}
  }

  getRawgImage = async () => {
    try {
      const {games} = await Rawger()
      const results = await games.search(this.name)
      const first = results.findOne()
  
      this.setState({image: first.image})
    } catch(e) { console.log(e) }
  }

  getGame = () => {
    const escLink = encodeURIComponent(this.link)
    const escName = encodeURIComponent(this.name)
    window.location.assign(`/game?link=${escLink}&name=${escName}`)
  }

  render() {
    return (
      <div className="gameListItem" link={this.link} onClick={this.getGame}>
        <img src={this.state.image} alt="Game Screenshot" width="250"/>
        <p className="title">{this.name}</p>
      </div>
    )
  }
}

export default GameListItem