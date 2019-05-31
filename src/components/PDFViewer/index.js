import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Page from './components/Page'
import AnnotationFinder from './components/AnnotationFinder'
import PDFJS from 'pdfjs-dist/webpack'
import { FlexGrid, CircularLoader, Alert, CheckboxLabel } from 'components'
import './pdf_viewer.css'
import { Util as dom_utils } from 'pdfjs-dist/lib/shared/util'
import Typography from '@material-ui/core/Typography'

PDFJS.GlobalWorkerOptions.workerSrc = '/pdf.worker.bundle.js'

export class PDFViewer extends Component {
  static propTypes = {
    document: PropTypes.object,
    allowSelection: PropTypes.bool,
    annotations: PropTypes.array,
    saveAnnotation: PropTypes.func,
    removeAnnotation: PropTypes.func,
    onCheckTextContent: PropTypes.func,
    showAvatars: PropTypes.bool,
    annotationModeEnabled: PropTypes.bool,
    showAnnoModeAlert: PropTypes.bool,
    onHideAnnoModeAlert: PropTypes.func,
    changeAnnotationIndex: PropTypes.func,
    currentAnnotationIndex: PropTypes.number,
    scrollTop: PropTypes.bool,
    resetScrollTop: PropTypes.func
  }
  
  static defaultProps = {
    annotations: [],
    document: {},
    allowSelection: false,
    showAvatars: false,
    showAnnoModeAlert: true,
    currentAnnotationIndex: 0,
    scrollTop: false
  }
  
  constructor(props, context) {
    super(props, context)
    this.viewerRef = React.createRef()
    this.state = {
      pdf: {},
      pages: [],
      pendingAnnotations: [],
      deleteAnnotationIndexes: {},
      alertConfirmOpen: false,
      deleteIndex: null,
      annoModeAlert: {
        open: false,
        dontShowAgain: false
      },
      initialRender: false
    }
  }
  
  componentDidMount() {
    if (this.props.document.content.data) {
      this.createPdf(this.props.document)
      this.setState({
        initialRender: true
      })
    }
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.document.content.data && this.props.document.content.data) {
      this.createPdf(this.props.document)
    }
    
    if (prevProps.allowSelection && !this.props.allowSelection) {
      this.setState({
        pendingAnnotations: []
      })
    }
    
    if ((!prevProps.scrollTop && this.props.scrollTop) || (prevState.initialRender && !this.state.initialRender)) {
      this.scrollTop()
    }
  }
  
  /**
   * Gets the PDF document using PDF.js
   * @param docContent
   */
  createPdf = docContent => {
    const CMAP = 'pdfjs-dist/cmaps'
    PDFJS.getDocument({ data: docContent.content.data, cMapUrl: CMAP }).then(pdf => {
      pdf.getMetadata().then(() => {
        this.setState({
          pdf
        }, () => this.gatherPagePromises())
      })
    })
  }
  
  /**
   * User saves pending annotation
   * @param index
   */
  saveAnnotation = index => {
    this.props.saveAnnotation(this.state.pendingAnnotations[index])
    this.setState({ pendingAnnotations: [] })
  }
  
  /**
   * User discards pending annotation
   */
  cancelAnnotation = () => {
    this.setState({ pendingAnnotations: [] })
  }
  
  /**
   * Opens an alert, asking the user to confirm deletion of annotation
   * @param index
   */
  confirmRemoveAnnotation = index => {
    this.setState({
      alertConfirmOpen: true,
      deleteIndex: index
    })
  }
  
  /**
   * User confirmed removing annotation
   */
  onRemoveAnnotation = () => {
    this.props.removeAnnotation(this.state.deleteIndex)
    this.setState({
      alertConfirmOpen: false,
      deleteIndex: null,
      deleteAnnotationIndexes: {}
    })
  }
  
  /**
   * User decided not to remove annotation
   */
  onCancelRemove = () => {
    this.setState({
      alertConfirmOpen: false,
      deleteIndex: null
    })
  }
  
  /**
   * For hiding the 'X' icon delete button for an annotation
   */
  hideDeleteIcon = () => {
    this.setState({
      deleteAnnotationIndexes: {}
    })
  }
  
  /**
   * For showing the 'X' icon delete button for an annotation
   * @param startPage
   * @param endPage
   * @param startPageIndex
   */
  showDeleteIcon = (startPage, endPage, startPageIndex) => {
    this.setState({
      deleteAnnotationIndexes: {
        [startPage]: startPageIndex,
        [endPage]: startPage === endPage ? startPageIndex : 0
      }
    })
  }
  
  /**
   * Gets page specific attributes
   * @returns {Promise<void>}
   */
  gatherPagePromises = async () => {
    let pagePromises = [], noText = []
    for (let i = 0; i < this.state.pdf.numPages; i++) {
      this[`page${i}ref`] = React.createRef()
      const page = await this.getSpecificPage(i)
      noText.push(page.textContent.items.length === 0)
      pagePromises.push(page)
    }
    
    const allPages = await Promise.all(pagePromises)
    this.props.onCheckTextContent(noText)
    this.setState({
      pages: allPages
    })
  }
  
  /**
   * Gets the actual PDF page
   * @param pageNumber
   * @returns {Promise<any>}
   */
  getSpecificPage = pageNumber => {
    return new Promise(resolve => {
      this.state.pdf.getPage(pageNumber + 1).then(page => {
        page.getTextContent({ normalizeWhitespace: true, enhanceTextSelection: true }).then(async textContent => {
          const pageToAdd = { page, textContent }
          resolve(pageToAdd)
        })
      })
    })
  }
  
  /**
   * Checks to see if rect1 and rect2 are basically the same
   * @param rect1
   * @param rect2
   * @returns {boolean}
   */
  matchRect = (rect1, rect2) => {
    return (
      (Math.abs(rect1.x - rect2.x) < 1)
      && (Math.abs(rect1.y - rect2.y) < 1)
      && (Math.abs(rect1.endX - rect2.endX) < 1)
      && (Math.abs(rect1.endY - rect2.endY) < 1)
    )
  }
  
  /**
   * Used to get the first text item on a page
   * @param endNode
   * @returns {*}
   */
  getFirstSibling = endNode => {
    let node = endNode.nodeType === 3 ? endNode.parentNode : endNode
    let found = false
    while (!found) {
      if (node.previousSibling === null) {
        found = true
      } else {
        node = node.previousSibling
      }
    }
    return node
  }
  
  /**
   * Used to get the last text item on a page
   * @param startNode
   * @returns {*}
   */
  getLastSibling = startNode => {
    let node = startNode.nodeType === 3 ? startNode.parentNode : startNode
    let found = false
    while (!found) {
      if (node.nextSibling === null) {
        found = true
      } else {
        node = node.nextSibling
      }
    }
    return node
  }
  
  /**
   * Determines the 'annotation' information for text selection at a specific Document.Range
   * @param rangeNumber
   * @param selection
   * @param pageNumber
   * @param renderContext
   * @returns {Array}
   */
  getSelectionForRange = (rangeNumber, selection, pageNumber, renderContext) => {
    const pageRect = this[`page${pageNumber}ref`].current.getClientRects()[0]
    const selectionRects = selection.getRangeAt(rangeNumber).getClientRects()
    let rects = []
    
    for (let i = 0; i < selectionRects.length; i++) {
      const r = selectionRects[i]
      const start = dom_utils.applyInverseTransform([
        r.left - pageRect.x, r.top - pageRect.y
      ], renderContext.viewport.transform)
      const end = dom_utils.applyInverseTransform([
        r.right - pageRect.x, r.bottom - pageRect.y
      ], renderContext.viewport.transform)
      
      const points = {
        x: start[0],
        y: start[1],
        endX: end[0],
        endY: end[1]
      }
      
      if (i > 0) {
        const previous = rects[rects.length - 1]
        if (!this.matchRect(previous.pdfPoints, points)) {
          rects = [...rects, { pageNumber: pageNumber, pdfPoints: points }]
        }
      } else {
        rects = [...rects, { pageNumber: pageNumber, pdfPoints: points }]
      }
    }
    return rects
  }
  
  /**
   * Gets the text selection of the screen. Splits it into various Ranges if it spans multiple pages.
   * @param renderContext
   * @param pageNumber
   */
  getSelection = (renderContext, pageNumber) => {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    let ranges = [], startPage = pageNumber, endPage = pageNumber
    
    let fullAnnotation = {
      docId: this.props.document._id,
      docName: this.props.document.name,
      rects: [],
      text: document.getSelection().toString(),
      length: 0,
      startPage: pageNumber,
      endPage: pageNumber
    }
    
    // the selection spans multiple pages
    if (range.commonAncestorContainer.className === 'pdfViewer') {
      startPage = parseInt(range.startContainer.parentNode.parentNode.getAttribute('data-page-number'))
      endPage = parseInt(range.endContainer.parentNode.parentNode.getAttribute('data-page-number'))
      
      fullAnnotation.startPage = startPage
      fullAnnotation.endPage = endPage
      
      const startRange = document.createRange()
      const lastSib = this.getLastSibling(range.startContainer)
      const lastTextSib = lastSib.childNodes[lastSib.childNodes.length - 1]
      startRange.setStart(range.startContainer, range.startOffset)
      startRange.setEnd(lastTextSib, lastTextSib.length)
      
      const endRange = document.createRange()
      const firstSib = this.getFirstSibling(range.endContainer)
      endRange.setStart(firstSib.childNodes[0], 0)
      endRange.setEnd(range.endContainer, range.endOffset)
      
      ranges.push({ pageNumber: startPage, range: startRange })
      ranges.push({ pageNumber: endPage, range: endRange })
      
      if ((endPage - startPage) > 1) {
        const start = startPage + 1
        
        // create a range for start and end page
        // selection spans more than two pages
        for (let x = start; x < endPage; x++) {
          const page = this[`page${x}ref`].current
          const textLayer = page.childNodes[2]
          const startNode = textLayer.childNodes[0].childNodes[0]
          const endNode = textLayer.childNodes[textLayer.childNodes.length - 1].childNodes[0]
          const r = document.createRange()
          r.setStart(startNode, 0)
          r.setEnd(endNode, endNode.length)
          ranges.push({ pageNumber: x, range: r })
        }
      }
    } else {
      ranges.push({ pageNumber, range })
    }
    
    for (let x = 0; x < ranges.length; x++) {
      selection.removeAllRanges()
      selection.addRange(ranges[x].range)
      const rects = this.getSelectionForRange(0, selection, ranges[x].pageNumber, renderContext)
      fullAnnotation.rects = [...fullAnnotation.rects, ...rects]
      fullAnnotation.length = fullAnnotation.length + rects.length
    }
    
    selection.removeAllRanges()
    
    this.setState({
      ...this.state,
      pendingAnnotations: [fullAnnotation]
    })
  }
  
  /**
   * Filters annotation rects and annotations by pageNumber
   * @param annos
   * @param pageNumber
   * @returns {*}
   */
  filterAnnosByPage = (annos, pageNumber) => {
    return annos
      .map((anno, i) => ({
        ...anno,
        rects: anno.rects.filter(rect => rect.pageNumber === pageNumber),
        mainListIndex: i
      }))
      .filter(anno => anno.startPage === pageNumber || anno.endPage === pageNumber)
  }
  
  /**
   *
   * @returns {*}
   */
  handleAnnoModeAlert = () => {
    if (this.props.showAnnoModeAlert && !this.props.annotationModeEnabled) {
      this.setState({
        annoModeAlert: {
          open: true,
          dontShowAgain: false
        }
      })
    }
  }
  
  /**
   * Hides the 'Annotation Mode Not Enabled' alert, calls a method to store to redux state if don't show again
   */
  dismissAnnoAlert = () => {
    this.setState({
      annoModeAlert: {
        ...this.state.annoModeAlert,
        open: false
      }
    })
    
    if (this.state.annoModeAlert.dontShowAgain) {
      this.props.onHideAnnoModeAlert()
    }
  }
  
  /**
   * Sets not showing annotation mode alert for the remainder of the app session
   */
  handleToggleDontShowAgain = () => {
    this.setState({
      annoModeAlert: {
        ...this.state.annoModeAlert,
        dontShowAgain: !this.state.annoModeAlert.dontShowAgain
      }
    })
  }
  
  /**
   * Handles scrolling to top of on initial render
   * @param pageNum
   */
  onFinishRendering = pageNum => {
    if (this.state.initialRender) {
      if (pageNum === this.state.pages.length - 1) {
        setTimeout(() => {
          this.setState({
            initialRender: false
          })
          clearTimeout()
        }, 1000)
      }
    }
  }
  
  /*
   * checks to see if annotation layer has rendered
   */
  checkIfRendered = position => {
    return document.getElementById(`annotation-${position}-0`)
  }
  
  /**
   * Scrolls to a specific annotations
   * @param position
   */
  handleScrollAnnotation = position => {
    let el = this.checkIfRendered(position)
    
    while (!el) {
      el = this.checkIfRendered(position)
      setTimeout(() => {
      }, 1000)
    }
    
    clearTimeout()
    const container = document.getElementById('viewContainer')
    const pageEl = el.offsetParent.offsetParent
    this.props.changeAnnotationIndex(position)
    container.scrollTo({ top: pageEl.offsetTop + el.offsetTop - 30, behavior: 'smooth' })
  }
  
  /**
   * Scrolls the document to the top of the page. Used when the user toggles a different coder for annotations
   */
  scrollTop = () => {
    if (this.props.annotations.length === 0) {
      const container = document.getElementById('viewContainer')
      container.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      this.handleScrollAnnotation(0)
    }
    this.props.resetScrollTop()
  }
  
  render() {
    const {
      pages, pendingAnnotations, deleteAnnotationIndexes, alertConfirmOpen, annoModeAlert
    } = this.state
    
    const { annotations, allowSelection, showAvatars, annotationModeEnabled, currentAnnotationIndex } = this.props
    
    const alertActions = [
      { onClick: this.onRemoveAnnotation, value: 'Delete', type: 'button' }
    ]
    
    const users = annotations.length > 0 ? Array.from(new Set(annotations.map(annotation => annotation.userId))) : []
    
    return (
      <>
        {(pages.length > 0 && annotations.length > 0) &&
        <AnnotationFinder
          userIds={users}
          count={annotations.length}
          current={currentAnnotationIndex}
          handleScrollAnnotation={this.handleScrollAnnotation}
        />}
        <div id="viewContainer" className="pdfViewer" style={{ position: 'relative' }} ref={this.viewerRef}>
          {pages.length > 0 && pages.map((page, i) => {
            const annotationsByPage = this.filterAnnosByPage(annotations, i)
            const pendingByPage = this.filterAnnosByPage(pendingAnnotations, i)
  
            return (
              <Page
                id={i}
                page={page.page}
                textContent={page.textContent}
                viewerDimensions={{
                  width: this.viewerRef.current.clientWidth,
                  height: this.viewerRef.current.clientHeight
                }}
                key={`page-${i}`}
                allowSelection={allowSelection}
                ref={this[`page${i}ref`]}
                annotations={annotationsByPage}
                pendingAnnotations={pendingByPage}
                saveAnnotation={this.saveAnnotation}
                cancelAnnotation={this.cancelAnnotation}
                getSelection={this.getSelection}
                showConfirmDelete={this.confirmDelete}
                showDeleteIcon={this.showDeleteIcon}
                hideDeleteIcon={this.hideDeleteIcon}
                annotationModeEnabled={annotationModeEnabled}
                handleAnnoModeAlert={this.handleAnnoModeAlert}
                confirmRemoveAnnotation={this.confirmRemoveAnnotation}
                showAvatars={showAvatars}
                onFinishRendering={this.onFinishRendering}
                deleteAnnotationIndex={(Object.keys(deleteAnnotationIndexes).length > 0 &&
                  deleteAnnotationIndexes.hasOwnProperty(i))
                  ? deleteAnnotationIndexes[i]
                  : null
                }
              />
            )
          })}
          <Alert
            actions={alertActions}
            open={alertConfirmOpen}
            onCloseAlert={this.onCancelRemove}
            title="Confirm deletion">
            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
              Do you want to delete this annotation?
            </Typography>
          </Alert>
          <Alert
            open={annoModeAlert.open}
            onCloseAlert={this.dismissAnnoAlert}
            title="Are you trying to annotate?"
            closeButton={{ value: 'Dismiss' }}>
            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
              You need to enable annotation mode to annotate for a selected answer. Click the 'Annotate' button next to an answer choice to enable annotation mode.
            </Typography>
            
            <CheckboxLabel
              input={{ value: annoModeAlert.dontShowAgain, onChange: this.handleToggleDontShowAgain }}
              label="Don't show me this message again."
            />
          </Alert>
          {pages.length === 0 &&
          <FlexGrid container flex style={{ height: '100%' }} align="center" justify="center">
            <CircularLoader />
          </FlexGrid>}
        </div>
      </>
    )
  }
}

export default PDFViewer
