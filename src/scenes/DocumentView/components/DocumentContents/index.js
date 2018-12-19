import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import FlexGrid from 'components/FlexGrid'
import PDFViewer from 'components/PDFViewer'
import Typography from '@material-ui/core/Typography'

export class DocumentContents extends Component {
  static propTypes = {
    document: PropTypes.object
  }

  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <FlexGrid raised container flex style={{ overflow: 'hidden', flexBasis: '70%', padding: 30, minWidth: '65%' }}>
        <FlexGrid container flex style={{ display: 'inline-flex', position: 'relative', marginBottom: 10 }}>
          <Typography variant="caption" style={{ fontSize: '.65rem', color: '#9e9e9e', marginBottom: 2 }}>
            Document Name
          </Typography>
          <Typography variant="subheading">{this.props.document.name}</Typography>
        </FlexGrid>
        {this.props.document.content.data && <PDFViewer document={this.props.document} />}
      </FlexGrid>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    document: state.scenes.docView.document || {}
  }
}

export default connect(mapStateToProps)(DocumentContents)