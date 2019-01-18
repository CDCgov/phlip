import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'
import theme from 'services/theme'
import { FlexGrid, Icon, PDFViewer, ApiErrorView } from 'components'
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
    annotatedDocs: PropTypes.array,
    docSelected: PropTypes.bool,
    openedDoc: PropTypes.object,
    answerSelected: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    annotations: PropTypes.array,
    questionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    saveUserAnswer: PropTypes.func,
    apiErrorInfo: PropTypes.shape({
      text: PropTypes.string,
      title: PropTypes.string
    }),
    apiErrorOpen: PropTypes.bool,
    showEmptyDocs: PropTypes.bool
  }

  static defaultProps = {
    actions: {},
    documents: [],
    annotated: [],
    showEmptyDocs: false,
    apiErrorOpen: false
  }

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.actions.getApprovedDocumentsRequest(this.props.projectId, this.props.jurisdictionId, this.props.page)
  }

  componentWillUnmount() {
    this.clearDocSelected()
  }

  onSaveAnnotation = annotation => {
    this.props.actions.saveAnnotation(annotation, this.props.answerSelected, this.props.questionId)
    this.props.saveUserAnswer()
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
            {this.props.docSelected ? this.props.openedDoc.name : 'Assigned Documents'}
          </Typography>
        </FlexGrid>
        <Divider />
        <FlexGrid container flex style={{ height: '100%', overflow: 'auto' }}>
          {this.props.apiErrorOpen && <ApiErrorView error={this.props.apiErrorInfo.text} />}
          {this.props.showEmptyDocs &&
          <FlexGrid container align="center" justify="center" flex>
            <Typography variant="display1" style={{ textAlign: 'center' }}>
              There no approved and/or assigned documents for this project and jurisdiction.
            </Typography>
          </FlexGrid>}
          {(!this.props.showEmptyDocs && this.props.answerSelected) &&
          <FlexGrid padding={20} container align="center" style={{ backgroundColor: '#e6f8ff' }}>
            <Typography>
              <i>
                <span style={{ fontWeight: 500, color: theme.palette.secondary.pageHeader }}>Annotation Mode:</span>
                {' '}
                <span style={{ color: '#757575' }}>Highlight the desired text and confirm.</span>
              </i>
            </Typography>
          </FlexGrid>}
          {(this.props.docSelected && !this.props.apiErrorOpen) &&
          <PDFViewer
            allowSelection={Boolean(this.props.answerSelected)}
            document={this.props.openedDoc}
            saveAnnotation={this.onSaveAnnotation}
            annotations={this.props.annotations}
          />}
          {!this.props.docSelected && this.props.documents.map((doc, i) => {
            return (
              <Fragment key={`${doc._id}`}>
                <FlexGrid container type="row" align="center" padding={10}>
                  <Typography>{i + 1}.</Typography>
                  <Typography style={docNameStyle}>
                    <span onClick={this.getContents(doc._id)}>{doc.name}</span>
                  </Typography>
                  {this.props.annotatedDocs.includes(doc._id) &&
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

  const annotationsForAnswer = answerSelected
    ? codingState.question.isCategoryQuestion
      ? JSON.parse(codingState.userAnswers[ownProps.questionId][codingState.selectedCategoryId].answers[answerSelected].annotations)
      : JSON.parse(codingState.userAnswers[ownProps.questionId].answers[answerSelected].annotations)
    : []

  const annotatedDocIdsForAnswer = annotationsForAnswer.map(annotation => annotation.docId)
  const notAnnotatedDocIds = pageState.documents.ordered.filter(docId => !annotatedDocIdsForAnswer.includes(docId))
  const annotatedDocIds = pageState.documents.ordered.filter(docId => annotatedDocIdsForAnswer.includes(docId))
  const annotatedForOpenDoc = annotationsForAnswer.filter(annotation => annotation.docId === pageState.openedDoc._id)
  const allDocIds = new Set([...annotatedDocIds, ...notAnnotatedDocIds])
  const docArray = Array.from(allDocIds)

  return {
    documents: docArray.length === 0
      ? []
      : pageState.documents.allIds.length === 0
        ? []
        : docArray.map(id => pageState.documents.byId[id]),
    annotatedDocs: annotatedDocIds,
    annotations: annotatedForOpenDoc,
    openedDoc: pageState.openedDoc || {},
    docSelected: pageState.docSelected || false,
    showEmptyDocs: pageState.showEmptyDocs,
    apiErrorInfo: pageState.apiErrorInfo,
    apiErrorOpen: pageState.apiErrorOpen,
    answerSelected
  }
}

/* istanbul-ignore-next */
const mapDispatchToProps = dispatch => ({
  actions: { ...bindActionCreators(actions, dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(DocumentList)