import React, { Component } from 'react'
import PropTypes from 'prop-types'

class TextNode extends Component {
  static propTypes = {
    text: PropTypes.object
  }

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
