import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import FlexGrid from 'components/FlexGrid'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import SearchBar from 'components/SearchBar'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'
import theme from 'services/theme'

const docNameStyle = {
  color: theme.palette.secondary.main,
  cursor: 'pointer',
  paddingLeft: 5
}

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
        <FlexGrid container flex padding={20}>
          {this.props.documents.map((doc, i) => {
            return (
              <Fragment key={`${doc._id}`}>
                <FlexGrid container type="row" padding={10}>
                  <Typography>{i+1}.</Typography>
                  <Typography style={docNameStyle}>{doc.name}</Typography>
                </FlexGrid>
                <Divider />
              </Fragment>
            )
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