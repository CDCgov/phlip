import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Page from './Page'
import PDFJS from 'pdfjs-dist/webpack'

PDFJS.GlobalWorkerOptions.workerSrc = '/pdf.worker.bundle.js'
import styles from './pdf_viewer.scss'
import { FlexGrid, CircularLoader } from 'components'

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

  render() {
    return (
      <div id="viewContainer" style={{ overflow: 'hidden', height: '100%' }}>
        <div id="viewer" ref={this.viewerRef} className={styles.pdfViewer}>
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