import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FlexGrid from 'components/FlexGrid'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import SearchBar from 'components/SearchBar'

export class DocumentList extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {

  }

  render() {
    return (
      <FlexGrid container style={{ width: '50%' }} raised>
        <FlexGrid container type="row" align="center" justify="space-between" padding="0 15px" style={{ height: 55 }}>
          <Typography variant="subheading" style={{ fontSize: 18 }}>Assigned Documents</Typography>
          <SearchBar></SearchBar>
        </FlexGrid>
        <Divider />
        <FlexGrid container flex>
        </FlexGrid>
      </FlexGrid>
    )
  }
}

export default DocumentList