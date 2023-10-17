import React, { Component } from 'react'
import { Input } from 'antd'

class SearchInput extends Component {
  inputRef = React.createRef()

  componentDidMount() {
    this.inputRef.current.focus()
  }

  render() {
    const { value, onInputChange } = this.props
    return (
      <Input
        placeholder="Type to search..."
        ref={this.inputRef}
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
        style={{ marginBottom: 24 }}
      />
    )
  }
}

export default SearchInput
