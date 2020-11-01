import React from 'react'

class GameListItem extends React.Component {
  constructor(props) {
    super(props)

    this.name = props.name
    this.link = props.link
  }

  render() {
    return (
      <div className="gameListItem">
        <p className="title">{this.name}</p>
      </div>
    )
  }
}

export default GameListItem