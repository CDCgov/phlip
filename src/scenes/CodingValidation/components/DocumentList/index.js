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
    annotationsForAnswer: PropTypes.array,
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
    annotations: [],
    showEmptyDocs: false,
    apiErrorOpen: false
  }

  constructor(props, context) {
    super(props, context)
  }

  state = {
    noTextContent: 2
  }

  componentDidMount() {
    this.props.actions.getApprovedDocumentsRequest(this.props.projectId, this.props.jurisdictionId, this.props.page)
  }

  componentWillUnmount() {
    this.clearDocSelected()
  }

  /*
   * Called when user chooses to save an annotation
   */
  onSaveAnnotation = annotation => {
    this.props.actions.saveAnnotation(annotation, this.props.enabledAnswerId, this.props.questionId)
    this.props.saveUserAnswer()
  }

  /**
   * Remove annotation
   * @param index
   */
  onRemoveAnnotation = index => {
    this.props.actions.removeAnnotation(index, this.props.enabledAnswerId, this.props.questionId)
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
    this.setState({
      noTextContent: 2
    })
  }

  /**
   * Handles when a user has selected a document that is not text-selectable
   */
  onCheckTextContent = noTextArr => {
    this.setState({
      noTextContent: noTextArr.every(noText => noText)
        ? 0
        : noTextArr.every(noText => !noText)
          ? 2
          : 1
    })
  }

  render() {
    const bannerBold = { fontWeight: 500, color: theme.palette.secondary.pageHeader }
    const bannerText = { color: '#434343' }

    const {
      annotationModeEnabled, annotations, docSelected, openedDoc, apiErrorOpen,
      showEmptyDocs, apiErrorInfo, isValidation, documents, annotatedDocs
    } = this.props

    const { noTextContent } = this.state

    return (
      <FlexGrid container flex style={{ overflow: 'hidden' }} raised>
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
            {docSelected &&
            <Icon color="black" style={{ cursor: 'pointer', paddingRight: 5 }} onClick={this.clearDocSelected}>
              arrow_back
            </Icon>}
            {docSelected ? openedDoc.name : 'Assigned Documents'}
          </Typography>
        </FlexGrid>
        <Divider />
        <FlexGrid container flex style={{ height: '100%', overflow: 'auto' }}>
          {apiErrorOpen && <ApiErrorView error={apiErrorInfo.text} />}
          {showEmptyDocs &&
          <FlexGrid container align="center" justify="center" flex>
            <Typography variant="display1" style={{ textAlign: 'center' }}>
              There no approved and/or assigned documents for this project and jurisdiction.
            </Typography>
          </FlexGrid>}
          {(!showEmptyDocs && annotationModeEnabled) &&
          <FlexGrid
            padding={20}
            container
            align="center"
            style={{ backgroundColor: noTextContent === 0 ? '#ffcbd3' : '#e6f8ff' }}>
            <Typography style={{ textAlign: 'center' }}>
              <i>
                {noTextContent > 0 ? (
                  <>
                    <span style={bannerBold}>Annotation Mode: </span>
                    <span style={bannerText}>
                      {docSelected
                        ? 'Highlight the desired text and confirm.'
                        : 'Select a document to annotate.'}
                    </span>
                  </>
                ) : (
                  <>
                    <span style={bannerBold}>NOTE: </span>
                    <span style={bannerText}>This document does not have text selection. You will not be able to annotate.</span>
                  </>
                )}
              </i>
            </Typography>
            {noTextContent === 1 &&
            <Typography style={{ textAlign: 'center', marginTop: 8 }}>
              <i>
                {noTextContent === 1 &&
                <>
                  <span style={bannerBold}>NOTE: </span>
                  <span style={bannerText}>
                    Some pages of this document do not have text selection. You will not be able to annotate those pages.
                  </span>
                </>}
              </i>
            </Typography>}
          </FlexGrid>}
          {(docSelected && !apiErrorOpen) &&
          <PDFViewer
            allowSelection={annotationModeEnabled}
            document={openedDoc}
            saveAnnotation={this.onSaveAnnotation}
            annotations={annotations}
            removeAnnotation={this.onRemoveAnnotation}
            onCheckTextContent={this.onCheckTextContent}
            annotationModeEnabled={annotationModeEnabled}
            showAvatars={isValidation}
          />}
          {!docSelected && documents.map((doc, i) => {
            return (
              <Fragment key={`${doc._id}`}>
                <FlexGrid container type="row" align="center" padding={10}>
                  <Typography>{i + 1}.</Typography>
                  <Typography style={docNameStyle}>
                    <span onClick={this.getContents(doc._id)}>{doc.name}</span>
                  </Typography>
                  {annotatedDocs.includes(doc._id) &&
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
  let annotations = [], question = {}

  if (pageState.annotationModeEnabled) {
    question = codingState.question.isCategoryQuestion
      ? codingState.userAnswers[ownProps.questionId][codingState.selectedCategoryId]
      : codingState.userAnswers[ownProps.questionId]
    annotations = question.answers[pageState.enabledAnswerId].annotations
  } else {
    annotations = pageState.annotations
  }

  const annotatedDocIdsForAnswer = annotations.map(annotation => annotation.docId)
  const notAnnotatedDocIds = pageState.documents.ordered.filter(docId => !annotatedDocIdsForAnswer.includes(docId))
  const annotatedDocIds = pageState.documents.ordered.filter(docId => annotatedDocIdsForAnswer.includes(docId))
  const annotatedForOpenDoc = annotations.map((annotation, index) => ({
    ...annotation,
    fullListIndex: index,
    userId: pageState.annotationModeEnabled ? question.validatedBy.userId : annotation.userId
  })).filter(annotation => annotation.docId === pageState.openedDoc._id)

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
    annotationModeEnabled: pageState.annotationModeEnabled,
    enabledAnswerId: pageState.enabledAnswerId,
    isValidation: state.scenes.codingValidation.coding.page === 'validation'
  }
}

/* istanbul-ignore-next */
const mapDispatchToProps = dispatch => ({
  actions: { ...bindActionCreators(actions, dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(DocumentList)
