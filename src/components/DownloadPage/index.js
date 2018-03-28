import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'

class DownloadPage extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    window.location.href = `/api/exports/project/${this.props.match.params.id}/data`
  }

  render() {
    return (
      <div style={{ paddingTop: 20, display: 'flex', alignItems: 'center' }}>
        <Typography type="display2">We're working on your export. The download will begin shortly...</Typography>
      </div>
    )
  }
}

export default DownloadPage