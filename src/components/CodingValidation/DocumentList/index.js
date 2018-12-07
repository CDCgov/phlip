import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FlexGrid from 'components/FlexGrid'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import SearchBar from 'components/SearchBar'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'

export class DocumentList extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.actions.getApprovedDocumentsRequest(this.props.projectId, this.props.jurisdictionId, this.props.page)
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
          {this.props.documents.map(doc => {
            return <p>{doc.name}</p>
          })}
        </FlexGrid>
      </FlexGrid>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const pageState = state.scenes[ownProps.page].documentList

  return {
    documents: pageState.documents.ordered.map(id => pageState.documents.byId[id]),
    jurisdictionId: ownProps.jurisdictionId,
    isValidation: ownProps.page === 'validation',
    projectId: ownProps.projectId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: { ...bindActionCreators(actions, dispatch) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentList)