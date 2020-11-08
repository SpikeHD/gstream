import React from 'react'
import './ModuleDropdown.css'

class ModuleDropdown extends React.Component {
  constructor(props) {
    super(props)

    this.current = 'None'
    this.changed = false
    
    this.state = {
      show: false
    }
  }

  componentDidMount = () => {
    this.current = this.props.options.find(m => this.props.defaultValue === m.filename || this.props.defaultValue === m.name).name
    this.forceUpdate()
  }

  handleSelect = () => {
    this.setState({show: !this.state.show})
  }

  renderOptions = () => {
    const elms = this.props.options.map(o => <li value={o.filename} onClick={() => this.setValue(o)}>{o.name}</li>)
    return elms
  }

  setValue = (val) => {
    this.current = val.name
    this.props.onSelect(val.filename)
    this.setState({show: false})
  }

  render() {
    return(
      <div className="select-list">
        <button onClick={this.handleSelect}>{this.current}</button>
        {this.state.show ?
          <ul className="select-options">
            {this.renderOptions()}
          </ul> : null
        }
      </div>
    )
  }
}

export default ModuleDropdown