import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'
import theme from 'services/theme'
import { FlexGrid, SearchBar, Icon, PDFViewer } from 'components'
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
    annotated: PropTypes.array,
    docSelected: PropTypes.bool,
    openedDoc: PropTypes.object
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

  getContents = id => () => {
    this.props.actions.getDocumentContentsRequest(id)
  }

  clearDocSelected = () => {
    this.props.actions.clearDocSelected()
  }

  render() {
    return (
      <FlexGrid container style={{ width: '50%', overflow: 'hidden' }} raised>
        <FlexGrid
          container
          type="row"
          align="center"
          padding="0 15px"
          justify="space-between"
          style={{ height: 55, minHeight: 55, maxHeight: 55 }}>
          <Typography
            variant="subheading"
            style={{ fontSize: '1.125rem', letterSpacing: 0, fontWeight: 500, alignItems: 'center', display: 'flex' }}>
            {this.props.docSelected &&
            <Icon color="black" style={{ cursor: 'pointer', paddingRight: 5 }} onClick={this.clearDocSelected}>
              arrow_back
            </Icon>}
            {this.props.docSelected
              ? this.props.openedDoc.name
              : 'Assigned Documents'}
          </Typography>
          {!this.props.docSelected && <SearchBar />}
        </FlexGrid>
        <Divider />
        <FlexGrid container flex padding={10} style={{ height: '100%' }}>
          {this.props.docSelected === true && <PDFViewer document={this.props.openedDoc} />}
          {this.props.docSelected === false && this.props.documents.map((doc, i) => {
            return (
              <Fragment key={`${doc._id}`}>
                <FlexGrid container type="row" align="center" padding={10}>
                  <Typography>{i + 1}.</Typography>
                  <Typography style={docNameStyle}>
                    <span onClick={this.getContents(doc._id)}>{doc.name}</span>
                  </Typography>
                  {this.props.annotated.includes(doc._id) &&
                  <Icon color="error" size={20}>
                    <FormatQuoteClose style={{ fontSize: 20 }} />
                  </Icon>}
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

/* istanbul-ignore-next */
const mapStateToProps = (state, ownProps) => {
  const pageState = state.scenes.codingValidation.documentList
  const codingState = state.scenes.codingValidation.coding
  const answerSelected = codingState.enabledAnswerChoice || false
  const isCategoryQuestion = !!codingState.selectedCategoryId

  return {
    documents: pageState.documents.ordered.map(id => pageState.documents.byId[id]),
    jurisdictionId: ownProps.jurisdictionId,
    projectId: ownProps.projectId,
    annotated: answerSelected
      ? isCategoryQuestion
        ? pageState.documents.annotated[codingState.question.id][codingState.selectedCategoryId] !== undefined
            ? pageState.documents.annotated[codingState.question.id][codingState.selectedCategoryId].byAnswer[codingState.enabledAnswerChoice]
            : []
        : pageState.documents.annotated[codingState.question.id].byAnswer[codingState.enabledAnswerChoice]
      //: pageState.documents.annotated[codingState.question.id].all,
      : [],
    openedDoc: pageState.openedDoc || {},
    docSelected: pageState.docSelected || false
  }
}

/* istanbul-ignore-next */
const mapDispatchToProps = dispatch => {
  return {
    actions: { ...bindActionCreators(actions, dispatch) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentList)