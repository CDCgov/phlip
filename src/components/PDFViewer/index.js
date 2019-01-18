import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Page from './Page'
import PDFJS from 'pdfjs-dist/webpack'
import { FlexGrid, CircularLoader } from 'components'
import './pdf_viewer.css'
import { Util as dom_utils } from 'pdfjs-dist/lib/shared/util'

PDFJS.GlobalWorkerOptions.workerSrc = '/pdf.worker.bundle.js'

export class PDFViewer extends Component {
  static propTypes = {
    document: PropTypes.object,
    allowSelection: PropTypes.bool,
    annotations: PropTypes.array,
    saveAnnotation: PropTypes.func
  }

  static defaultProps = {
    annotations: [],
    document: {},
    allowSelection: false
  }

  constructor(props, context) {
    super(props, context)
    this.viewerRef = React.createRef()
    this.state = {
      pdf: {},
      pages: [],
      pendingAnnotations: []
    }
  }

  componentDidMount() {
    if (this.props.document.content.data) {
      this.createPdf(this.props.document)
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.document.content.data && this.props.document.content.data) {
      this.createPdf(this.props.document)
    }
  }

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

  saveAnnotation = index => {
    this.props.saveAnnotation(this.state.pendingAnnotations[index])
    this.setState({
      pendingAnnotations: []
    })
  }

  cancelAnnotation = index => {
    this.setState({
      pendingAnnotations: []
    })
  }

  gatherPagePromises = async () => {
    let pagePromises = []
    for (let i = 0; i < this.state.pdf.numPages; i++) {
      this[`page${i}ref`] = React.createRef()
      pagePromises.push(this.getSpecificPage(i))
    }

    const allPages = await Promise.all(pagePromises)
    this.setState({
      pages: allPages
    })
  }

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

  matchRects = (rect1, rect2) => {
    return (
      (Math.round(rect1.x) === Math.round(rect2.x))
      && (Math.round(rect1.y) === Math.round(rect2.y))
      && (Math.round(rect1.endX) === Math.round(rect2.endX))
      && (Math.round(rect1.endY) === Math.round(rect2.endY))
    )
  }

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
        if (!this.matchRects(previous.pdfPoints, points)) {
          rects = [...rects, { pageNumber: pageNumber, pdfPoints: points }]
        }
      } else {
        rects = [...rects, { pageNumber: pageNumber, pdfPoints: points }]
      }
    }
    return rects
  }

  getSelection = (renderContext, pageNumber) => {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    let ranges = [], startPage = pageNumber, endPage = pageNumber

    let fullAnnotation = {
      docId: this.props.document._id,
      rects: [],
      text: document.getSelection().toString(),
      length: 0,
      startPage: pageNumber,
      endPage: pageNumber
    }

    // the selection spans multiple pages
    if (range.commonAncestorContainer.className !== 'textLayer') {
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
    //selection.addRange(range)
    //selection.removeAllRanges()

    this.setState({
      ...this.state,
      pendingAnnotations: [fullAnnotation]
    })
  }

  filterByPage = (anno, pageNumber) => {
    return {
      ...anno,
      rects: anno.rects.filter(rect => rect.pageNumber === pageNumber)
    }
  }

  render() {
    return (
      <div id="viewContainer" className="pdfViewer" ref={this.viewerRef}>
        {this.state.pages.length > 0
        && this.state.pages.map((page, i) => {
            return (
              <Page
                id={i}
                page={page.page}
                textContent={page.textContent}
                viewerDimensions={{
                  width: this.viewerRef.current.clientWidth,
                  height: this.viewerRef.current.clientHeight
                }}
                docId={this.props.document._id}
                key={`page-${i}`}
                allowSelection={this.props.allowSelection}
                ref={this[`page${i}ref`]}
                annotations={this.props.annotations.map(anno => this.filterByPage(anno, i))}
                pendingAnnotations={this.state.pendingAnnotations.map(anno => this.filterByPage(anno, i))}
                saveAnnotation={this.saveAnnotation}
                cancelAnnotation={this.cancelAnnotation}
                getSelection={this.getSelection}
              />
            )
          }
        )}
        {this.state.pages.length === 0 &&
        <FlexGrid container flex style={{ height: '100%' }} align="center" justify="center">
          <CircularLoader />
        </FlexGrid>}
      </div>
    )
  }
}

export default PDFViewer