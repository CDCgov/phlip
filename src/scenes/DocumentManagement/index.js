import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from 'components/Grid'

export class DocumentManagement extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <Grid flex padding="0 0 25px 0">
        <div>document management</div>
      </Grid>
    )
  }
}

DocumentManagement.propTypes = {}

export default DocumentManagement