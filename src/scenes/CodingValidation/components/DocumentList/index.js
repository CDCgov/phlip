import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'
import theme from 'services/theme'
import { FlexGrid, Icon, PDFViewer } from 'components'
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
    openedDoc: PropTypes.object,
    answerSelected: PropTypes.bool
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

  /**
   * Gets the actual document contents when a document is clicked
   */
  getContents = id => () => {
    this.props.actions.getDocumentContentsRequest(id)
  }

  /**
   * Clears what document is selected
   */
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
        </FlexGrid>
        <Divider />
        <FlexGrid container padding={10} flex style={{ height: '100%' }}>
          {this.props.answerSelected &&
          <FlexGrid padding={20} container align="center" style={{ backgroundColor: '#e6f8ff' }}>
            <Typography>
              <i>
                <span style={{ fontWeight: 500, color: theme.palette.secondary.pageHeader }}>Annotation Mode:</span>
                {' '}
                <span style={{ color: '#757575' }}>Highlight the desired text and confirm. </span>
              </i>
            </Typography>
          </FlexGrid>
          }
          {this.props.docSelected === true &&
          <PDFViewer allowSelection={this.props.answerSelected} document={this.props.openedDoc} />}
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

  const annotatedToShow = answerSelected
    ? isCategoryQuestion
      ? pageState.documents.annotated[codingState.question.id][codingState.selectedCategoryId] !== undefined
        ? pageState.documents.annotated[codingState.question.id][codingState.selectedCategoryId].byAnswer[codingState.enabledAnswerChoice]
        : []
      : pageState.documents.annotated[codingState.question.id].byAnswer[codingState.enabledAnswerChoice]
    : []

  const ordered = pageState.documents.ordered
  const filteredOrder = ordered.filter(doc => !annotatedToShow.includes(doc))
  const filteredAnnos = ordered.filter(doc => annotatedToShow.includes(doc))

  return {
    documents: [...filteredAnnos, ...filteredOrder].map(id => pageState.documents.byId[id]),
    jurisdictionId: ownProps.jurisdictionId,
    projectId: ownProps.projectId,
    annotated: annotatedToShow,
    openedDoc: pageState.openedDoc || {},
    docSelected: pageState.docSelected || false,
    answerSelected
  }
}

/* istanbul-ignore-next */
const mapDispatchToProps = dispatch => {
  return {
    actions: { ...bindActionCreators(actions, dispatch) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentList)