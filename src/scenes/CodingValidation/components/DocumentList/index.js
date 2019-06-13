import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'
import theme from 'services/theme'
import { FlexGrid, Icon, PDFViewer, ApiErrorView, CircularLoader } from 'components'
import { FormatQuoteClose } from 'mdi-material-ui'

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
    enabledAnswerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    annotations: PropTypes.array,
    annotationsForAnswer: PropTypes.array,
    annotationModeEnabled: PropTypes.bool,
    isValidation: PropTypes.bool,
    questionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    saveUserAnswer: PropTypes.func,
    apiError: PropTypes.shape({
      text: PropTypes.string,
      title: PropTypes.string,
      open: PropTypes.bool
    }),
    currentAnnotationIndex: PropTypes.number,
    showEmptyDocs: PropTypes.bool,
    shouldShowAnnoModeAlert: PropTypes.bool,
    scrollTop: PropTypes.bool,
    gettingDocs: PropTypes.bool,
    annotationUsers: PropTypes.array
  }
  
  static defaultProps = {
    actions: {},
    documents: [],
    annotations: [],
    showEmptyDocs: false,
    apiError: {
      text: '',
      title: '',
      open: false
    },
    currentAnnotationIndex: 0,
    scrollTop: false,
    gettingDocs: false
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
  
  /**
   * Toggles whether or not to show the annotation mode not enabeld alert
   */
  hideAnnoModeAlert = () => {
    this.props.actions.hideAnnoModeAlert()
  }
  
  /**
   * Handles changing current annotation index in annotation finder
   */
  changeAnnotationIndex = index => {
    this.props.actions.changeAnnotationIndex(index)
  }
  
  /**
   * Sets scroll top to false after changing it to true
   */
  resetScrollTop = () => {
    this.props.actions.resetScrollTop()
  }
  
  onToggleCoderAnnotations = (userId, isValidator) => {
    this.props.actions.toggleCoderAnnotations(userId, isValidator)
  }
  
  render() {
    const docNameStyle = {
      color: theme.palette.secondary.main,
      cursor: 'pointer',
      paddingLeft: 5,
      paddingRight: 5
    }
    
    const bannerBold = { fontWeight: 500, color: theme.palette.secondary.pageHeader }
    const bannerText = { color: '#434343' }
    
    const {
      annotationModeEnabled, annotations, docSelected, openedDoc, currentAnnotationIndex, scrollTop,
      showEmptyDocs, apiError, documents, annotatedDocs, shouldShowAnnoModeAlert, gettingDocs, annotationUsers,
      isValidation
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
        <FlexGrid container flex style={{ height: '100%', overflow: 'auto', position: 'relative' }}>
          {apiError.open && <ApiErrorView error={apiError.text} />}
          {(showEmptyDocs || gettingDocs) && <FlexGrid container align="center" justify="center" padding={10} flex>
            <Typography variant="display1" style={{ textAlign: 'center' }}>
              {showEmptyDocs
                ? 'There are no approved or assigned documents for this project and jurisdiction.'
                : 'Loading...'}
              {gettingDocs &&
              <span style={{ marginLeft: 10 }}><CircularLoader color="primary" thickness={5} size={28} /></span>}
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
                    <span style={bannerText}>You are unable to annotate this document. Text selection is not allowed.</span>
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
          {(docSelected && !apiError.open) &&
          <PDFViewer
            allowSelection={annotationModeEnabled}
            document={openedDoc}
            annotations={annotations}
            saveAnnotation={this.onSaveAnnotation}
            removeAnnotation={this.onRemoveAnnotation}
            onCheckTextContent={this.onCheckTextContent}
            annotationModeEnabled={annotationModeEnabled}
            showAvatars
            isValidation={isValidation}
            currentAnnotationIndex={currentAnnotationIndex}
            changeAnnotationIndex={this.changeAnnotationIndex}
            showAnnoModeAlert={shouldShowAnnoModeAlert}
            onHideAnnoModeAlert={this.hideAnnoModeAlert}
            scrollTop={scrollTop}
            toggleCoderAnnotations={this.onToggleCoderAnnotations}
            annotationUsers={annotationUsers}
            resetScrollTop={this.resetScrollTop}
            isView={false}
          />}
          {!docSelected && documents.map((doc, i) => {
            const isRetrieving = (openedDoc._id === doc._id) && !docSelected
            return (
              <Fragment key={`${doc._id}`}>
                <FlexGrid container type="row" align="center" padding={10}>
                  <Typography>{i + 1}.</Typography>
                  <Typography
                    style={{
                      ...docNameStyle,
                      color: isRetrieving ? '#757575' : theme.palette.secondary.main
                    }}>
                    <span style={{ paddingRight: 10 }} onClick={this.getContents(doc._id)}>{doc.name}</span>
                  </Typography>
                  {isRetrieving &&
                  <div style={{ height: 17, width: 17 }}>
                    <CircularLoader color="primary" thickness={5} size={16} />
                  </div>}
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
export const mapStateToProps = state => {
  const pageState = state.scenes.codingValidation.documentList
  const annotations = pageState.annotations.filtered
  const users = pageState.annotationUsers.filtered
  const isValidation = state.scenes.codingValidation.coding.page === 'validation'
  
  /** Get docs ids and sort by annotated first */
  const annotatedDocIdsForAnswer = annotations.map(annotation => annotation.docId)
  const notAnnotatedDocIds = pageState.documents.ordered.filter(docId => !annotatedDocIdsForAnswer.includes(docId))
  const annotatedDocIds = pageState.documents.ordered.filter(docId => annotatedDocIdsForAnswer.includes(docId))
  const annos = annotations.slice()
  
  /**
   * The annotations need to be sorted in the order they are on the pdf page for jump to
   */
  const sortedByPageAndPosition = annos.sort((a, b) => {
    const diff = a.startPage - b.startPage
    return diff === 0
      ? b.rects[0].pdfPoints.y - a.rects[0].pdfPoints.y
      : diff
  }).map((anno, i) => ({ ...anno, sortPosition: i }))
  
  const allDocIds = new Set([...annotatedDocIds, ...notAnnotatedDocIds])
  const docArray = Array.from(allDocIds)
  
  return {
    documents: docArray.length === 0
      ? []
      : pageState.documents.allIds.length === 0
        ? []
        : docArray.map(id => pageState.documents.byId[id]),
    annotatedDocs: annotatedDocIds,
    annotations: sortedByPageAndPosition,
    openedDoc: pageState.openedDoc || {},
    docSelected: pageState.docSelected || false,
    showEmptyDocs: pageState.showEmptyDocs,
    apiError: pageState.apiError,
    annotationModeEnabled: pageState.annotationModeEnabled,
    enabledAnswerId: pageState.enabledAnswerId,
    shouldShowAnnoModeAlert: pageState.shouldShowAnnoModeAlert,
    currentAnnotationIndex: pageState.currentAnnotationIndex,
    scrollTop: pageState.scrollTop,
    isValidation,
    gettingDocs: pageState.gettingDocs,
    annotationUsers: users,
    enabledUserId: pageState.enabledUserId
  }
}

/* istanbul-ignore-next */
const mapDispatchToProps = dispatch => ({
  actions: { ...bindActionCreators(actions, dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(DocumentList)
