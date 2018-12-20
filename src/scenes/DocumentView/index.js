import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FlexGrid from 'components/FlexGrid'
import PageHeader from 'components/PageHeader'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'
import DocumentContents from './components/DocumentContents'
import DocumentMeta from './components/DocumentMeta'

export class DocumentView extends Component {
  static propTypes = {
    document: PropTypes.object,
    documentRequestInProgress: PropTypes.bool,
    documentUpdateInProgress: PropTypes.bool,
    actions: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object
  }

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.actions.initState(this.props.location.state.document)
    this.props.actions.getDocumentContentsRequest(this.props.location.state.document._id)
  }

  componentWillUnmount() {
    this.props.actions.clearDocument()
  }

  onGoBack = () => {
    this.props.history.push('/docs')
  }

  render() {
    return (
      <FlexGrid container flex padding="12px 20px 20px 20px">
        <PageHeader
          onBackButtonClick={this.onGoBack}
          pageTitle="Edit Document"
          protocolButton={false}
          projectName=""
        />
        <FlexGrid container type="row" flex style={{ height: '100%' }}>
          <DocumentContents loading={this.props.documentRequestInProgress} />
          <FlexGrid style={{ flexBasis: '2%' }} />
          <FlexGrid
            container
            type="column"
            style={{
              flexBasis: '25%',
              flex: '1 1 25%'
            }}>
            <DocumentMeta
              document={this.props.document}
              loading={this.props.documentRequestInProgress}
              updating={this.props.documentUpdateInProgress}
            />
          </FlexGrid>
        </FlexGrid>
      </FlexGrid>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => {
  return {
    document: state.scenes.docView.document,
    documentRequestInProgress: state.scenes.docView.documentRequestInProgress,
    documentUpdatingInProgress: state.scenes.docView.documentUpdateInProgress
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(DocumentView)
