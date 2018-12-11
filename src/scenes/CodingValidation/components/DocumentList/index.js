import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'
import theme from 'services/theme'
import { FlexGrid, SearchBar, Icon } from 'components'
import { FormatQuoteClose } from 'mdi-material-ui'

const docNameStyle = {
  color: theme.palette.secondary.main,
  cursor: 'pointer',
  paddingLeft: 5,
  paddingRight: 5
}

export class DocumentList extends Component {
  static propTypes = {
    actions: PropTypes.object,
    jurisdictionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    page: PropTypes.oneOf(['coding', 'validation']),
    documents: PropTypes.array,
    annotated: PropTypes.array
  }

  static defaultProps = {
    actions: {},
    documents: [],
    annotated: []
  }

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
          <Typography variant="subheading" style={{ fontSize: '1.125rem', letterSpacing: 0, fontWeight: 500 }}>
            Assigned Documents
          </Typography>
          <SearchBar></SearchBar>
        </FlexGrid>
        <Divider />
        <FlexGrid container flex padding={20}>
          {this.props.documents.map((doc, i) => {
            return (
              <Fragment key={`${doc._id}`}>
                <FlexGrid container type="row" align="center" padding={10}>
                  <Typography>{i + 1}.</Typography>
                  <Typography style={docNameStyle}>{doc.name}</Typography>
                  {this.props.annotated.includes(doc._id) && <Icon color="error" size={24}><FormatQuoteClose /></Icon>}
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
  const pageState = state.scenes.codingValidation.documentList
  const codingState = state.scenes.codingValidation.coding
  const answerSelected = codingState.selectedAnswerId || false

  return {
    documents: pageState.documents.ordered.map(id => pageState.documents.byId[id]),
    jurisdictionId: ownProps.jurisdictionId,
    projectId: ownProps.projectId,
    annotated: answerSelected
      ? pageState.documents.annotated[codingState.question.id].byAnswer[codingState.selectedAnswerId]
      : pageState.documents.annotated[codingState.question.id].all
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: { ...bindActionCreators(actions, dispatch) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentList)