import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Page from './Page'
import PDFJS from 'pdfjs-dist/webpack'
PDFJS.GlobalWorkerOptions.workerSrc = '/pdf.worker.bundle.js'
import styles from './pdf_viewer.scss'

export class PDFViewer extends Component {
  static propTypes = {}
  state = {
    pdf: {},
    pages: []
  }

  constructor(props, context) {
    super(props, context)
    this.viewerRef = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.document.content.data && this.props.document.content.data) {
      this.createPdf(this.props.document)
    }
  }

  createPdf = docContent => {
    const CMAP = 'pdfjs-dist/cmaps'
    PDFJS.getDocument({ data: docContent.content.data, cMapUrl: CMAP }).then(pdf => {
      pdf.getMetadata().then(md => {
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
    return new Promise((resolve, reject) => {
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
      <div id="viewContainer" style={{ overflow: 'auto', height: '100%' }}>
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
        </div>
      </div>
    )
  }
}

export default PDFViewer