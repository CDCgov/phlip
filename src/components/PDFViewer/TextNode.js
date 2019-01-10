import React, { Component } from 'react'

class TextNode extends Component {
  constructor(props, context) {
    super(props, context)
    this.root = React.createRef()
  }

  render() {
    const { text } = this.props

    return (
      <div style={text.style} ref={this.root}>
        {text.str}
      </div>
    )
  }
}

export default TextNode
