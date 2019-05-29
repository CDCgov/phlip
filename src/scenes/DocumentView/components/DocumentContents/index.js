import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import FlexGrid from 'components/FlexGrid'
import PDFViewer from 'components/PDFViewer'
import Typography from '@material-ui/core/Typography'
import { ApiErrorView } from 'components'

export class DocumentContents extends Component {
  static propTypes = {
    document: PropTypes.object,
    id : PropTypes.string,
    error: PropTypes.string
  }

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { document, error, id } = this.props
    
    return (
      <FlexGrid raised container flex style={{ overflow: 'hidden', flexBasis: '70%', padding: 20, minWidth: '65%' }} id={id}>
        <FlexGrid container style={{ display: 'inline-flex', position: 'relative', marginBottom: 10 }}>
          <Typography variant="caption" style={{ fontSize: '.65rem', color: '#9e9e9e', marginBottom: 2 }}>
            Document Name
          </Typography>
          <Typography variant="subheading" id="docName">{document.name}</Typography>
        </FlexGrid>
        {error !== '' && <ApiErrorView error={error} />}
        {document.content.data && <PDFViewer document={document} showAnnoModeAlert={false} />}
      </FlexGrid>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    document: state.scenes.docView.document || {},
    error: state.scenes.docView.error || ''
  }
}

export default connect(mapStateToProps)(DocumentContents)
