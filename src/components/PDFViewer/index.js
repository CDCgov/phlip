import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Page from './Page'
import PDFJS from 'pdfjs-dist/webpack'
import { FlexGrid, CircularLoader } from 'components'
import * as pdfjs from 'pdfjs-dist/web/pdf_viewer.js'
import './pdf_viewer.css'
PDFJS.GlobalWorkerOptions.workerSrc = '/pdf.worker.bundle.js'

export class PDFViewer extends Component {
  static propTypes = {
    document: PropTypes.object,
    allowSelection: PropTypes.bool,
    captureArea: PropTypes.any
  }

  constructor(props, context) {
    super(props, context)
    this.viewerRef = React.createRef()
    this.state = {
      pdf: {},
      pages: []
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

  gatherPagePromises = async () => {
    let pagePromises = []
    for (let i = 0; i < this.state.pdf.numPages; i++) {
      this[`page${i + 1}Ref`] = React.createRef()
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
        let pageToAdd = {}
        page.getTextContent({ normalizeWhitespace: true }).then(async textContent => {
          pageToAdd = { page, textContent }
          resolve(pageToAdd)
        })
      })
    })
  }

  draw = async pdf => {
    let scale = 1
    for (let i = 1; i <= pdf.numPages; i++) {
      await new Promise((resolve) => {
        pdf.getPage(i).then((page) => {
          let pdfPageView = new pdfjs.PDFPageView({
            container: this.viewerRef.current,
            id: i,
            scale,
            defaultViewport: page.getViewport(scale),
            enhanceTextSelection: true,
            textLayerFactory: new pdfjs.DefaultTextLayerFactory,
            annotationLayerFactory: new pdfjs.DefaultAnnotationLayerFactory
          })
          pdfPageView.setPdfPage(page)

          let annotationsDiv = document.createElement('div')
          annotationsDiv.setAttribute('class', 'annotationLayer')
          pdfPageView.div.appendChild(annotationsDiv)
          pdfPageView.annotationLayer = new pdfjs.AnnotationLayerBuilder({
            pageDiv: pdfPageView.div,
            pdfPage: page
          })
          annotationsDiv.width = pdfPageView.div.width
          annotationsDiv.height = pdfPageView.div.height
          pdfPageView.annotationLayer.div = annotationsDiv
          this.pdfPageView = pdfPageView
          pdfPageView.draw().then(() => {
            document.addEventListener('textlayerrendered', (event) => {
              if (event.detail.pageNumber === i) {
                this.pdfProgress = (i / (pdf.numPages - 1)) * 100

                resolve(i)
              }
            })
          })
        })
      })
    }
    return 'done'
  }

  render() {
    return (
      <div id="viewContainer">
        <div id="viewer" className="pdfViewer" ref={this.viewerRef}>
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
                  key={`page-${i}`}
                  allowSelection={this.props.allowSelection}
                  ref={this[`page${i + 1}Ref`]}
                  annotations={page.annotations}
                  captureArea={this.props.captureArea}
                />
              )
            }
          )}
          {this.state.pages.length === 0 &&
          <FlexGrid container flex style={{ height: '100%' }} align="center" justify="center">
            <CircularLoader />
          </FlexGrid>}
        </div>
      </div>
    )
  }
}

export default PDFViewer