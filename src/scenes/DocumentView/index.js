import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FlexGrid from 'components/FlexGrid'
import PageHeader from 'components/PageHeader'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'

export class DocumentView extends Component {
  static propTypes = {}

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.actions.initState(this.props.location.state.document)
    // will call API to get document from Mongo using action creator
  }

  onGoBack = () => {
    this.props.history.push('/docs')
  }

  render() {
    return (
      <FlexGrid container flex padding="20px 30px">
        <PageHeader
          onBackButtonClick={this.onGoBack}
          pageTitle="Edit Document"
          protocolButton={false}
          projectName=""
        />
        <FlexGrid container type="row">
          <FlexGrid raised flex>
            {/**
             * this is where the pdf will go
             */}
          </FlexGrid>
          <FlexGrid container type="column">
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
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(DocumentView)