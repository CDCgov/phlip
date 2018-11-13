import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FlexGrid from 'components/FlexGrid'
import PDFViewer from 'components/PDFViewer'
import { connect } from 'react-redux'

export class DocumentContents extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <FlexGrid raised flex style={{ height: '100%', overflow: 'hidden', flexBasis: '70%' }}>
        <PDFViewer document={this.props.document} />
      </FlexGrid>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    document: state.scenes.docView.document
  }
}

export default connect(mapStateToProps)(DocumentContents)