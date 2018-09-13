import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from 'components/Grid'
import PageHeader from 'components/PageHeader'
import DocList from './components/DocList'

export class DocumentManagement extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <Grid container flex padding="20px 30px">
        <PageHeader
          showButton={true}
          pageTitle="Document Management"
          protocolButton={false}
          projectName=""
          entryScene={true}
          icon="description"
          otherButton={{
            isLink: true,
            text: '+ Upload New',
            path: '/docs/upload',
            state: { modal: true },
            props: { 'aria-label': 'Upload New Documents' },
            show: true
          }}
        />
        <DocList />
      </Grid>
    )
  }
}

DocumentManagement.propTypes = {}

export default DocumentManagement