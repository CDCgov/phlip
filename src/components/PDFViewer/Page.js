import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { transformText } from './textTransformHelpers'
import * as ui_utils from 'pdfjs-dist/lib/web/ui_utils'
import { Util as dom_utils } from 'pdfjs-dist/lib/shared/util'
import { CircularLoader, FlexGrid, IconButton } from 'components/index'
import './pdf_viewer.css'
import TextNode from './TextNode'

class Page extends Component {
  static defaultProps = {
    annotations: [],
    allowSelection: false,
    textContent: {
      items: []
    }
  }

  static propTypes = {
    annotations: PropTypes.array,
    allowSelection: PropTypes.bool,
    textContent: PropTypes.object
  }

  constructor(props, context) {
    super(props, context)

    this.shouldRerenderPdf = true
    this.canvasRef = React.createRef()
    this.pageRef = React.createRef()
    this.textLayerRef = React.createRef()

    this.state = {
      renderContext: {
        viewport: {
          width: props.viewerDimensions.width,
          height: props.viewerDimensions.height
        }
      },
      annotations: [],
      pendingAnnotations: [],
      rendering: false,
      renderToRenderText: false,
      canvasStyleSpecs: {},
      textLineStyleSpecs: {},
      noText: false,
      selectionStyle: {},
      highlights: [],
      pending: false
    }

    this.allTextDivs = []
  }

  componentDidMount() {
    this.setCanvasSpecs()
  }

  handleConfirmAnnotation = index => {
    this.setState({
      pending: false
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

  onMouseUp = () => {
    const color = new Uint8ClampedArray()
    color[0] = 251
    color[1] = 237
    color[2] = 158

    if (this.props.allowSelection && !this.state.pending) {
      const range = document.getSelection().getRangeAt(0)
      const pageRect = this.pageRef.current.getClientRects()[0]
      const selectionRects = range.getClientRects()

      let fullAnnotation = {
        pages: [this.props.id],
        rects: [],
        text: document.getSelection().toString(),
        length: selectionRects.length
      }

      for (let i = 0; i < selectionRects.length; i++) {
        const r = selectionRects[i]
        const start = dom_utils.applyInverseTransform([
          r.left - pageRect.x, r.top - pageRect.y
        ], this.state.renderContext.viewport.transform)

        const end = dom_utils.applyInverseTransform([
          r.right - pageRect.x, r.bottom - pageRect.y
        ], this.state.renderContext.viewport.transform)

        const points = {
          x: start[0],
          y: start[1],
          endX: end[0],
          endY: end[1]
        }

        if (i > 0) {
          const previous = fullAnnotation.rects[fullAnnotation.rects.length - 1]
          if (!this.matchRects(previous.pdfPoints, points)) {
            fullAnnotation.rects = [
              ...fullAnnotation.rects,
              {
                pageNumber: this.props.id,
                pdfPoints: points
              }
            ]
          }
        } else {
          fullAnnotation.rects = [
            ...fullAnnotation.rects,
            {
              pageNumber: this.props.id,
              pdfPoints: points
            }
          ]
        }
      }

      this.setState({
        pendingAnnotations: [],
        annotations: [
          ...this.state.annotations,
          {
            ...fullAnnotation,
            startRect: fullAnnotation.rects[0],
            endRect: fullAnnotation.rects[fullAnnotation.rects.length]
          }
        ],
        pending: true
      })
    }
  }

  /**
   * Renders the PDF page
   */
  renderPage = () => {
    if (this.shouldRerenderPdf === true) {
      this.props.page.destroyed === false && this.props.page.render(this.state.renderContext)
      this.shouldRerenderPdf = false
    }
  }

  /**
   * Determines to what scale to render the PDF page based on the size of the screen
   */
  setCanvasSpecs = () => {
    const vp = this.props.page.getViewport(1)
    let scale = this.state.renderContext.viewport.width / vp.width
    if (scale < 1.4) {
      scale = 1.4
    }
    const viewport = this.props.page.getViewport(scale)
    const canvasContext = this.canvasRef.current.getContext('2d', { alpha: false })

    let outputScale = ui_utils.getOutputScale(canvasContext)
    const pixelsInViewport = viewport.width * viewport.height
    const maxScale = Math.sqrt(16777216 / pixelsInViewport)
    if (outputScale.sx > maxScale || outputScale.sy > maxScale) {
      outputScale.sx = maxScale
      outputScale.sy = maxScale
      outputScale.scaled = true
    }

    const sfx = ui_utils.approximateFraction(outputScale.sx)
    const sfy = ui_utils.approximateFraction(outputScale.sy)
    let canvas = { style: {} }

    canvas.width = ui_utils.roundToDivide(viewport.width * outputScale.sx, sfx[0])
    canvas.height = ui_utils.roundToDivide(viewport.height * outputScale.sy, sfy[0])
    canvas.style.width = ui_utils.roundToDivide(viewport.width, sfx[1]) + 'px'
    canvas.style.height = ui_utils.roundToDivide(viewport.height, sfy[1]) + 'px'
    const transform = outputScale.scaled ? [outputScale.sx, 0, 0, outputScale.sy, 0, 0] : null

    const renderContext = {
      canvasContext,
      transform,
      viewport
    }

    this.setState({
      renderContext,
      canvasStyleSpecs: {
        ...canvas
      }
    }, () => this.generateTextElements())
  }

  generateTextElements = () => {
    if (this.props.textContent.items.length === 0) {
      this.setState({
        noText: true,
        readyToRenderText: true
      })
    } else {
      this.props.textContent.items.forEach((item, i) => {
        const textDivStyles = transformText(
          this.state.renderContext.viewport,
          item,
          this.props.textContent.styles,
          this.state.renderContext.canvasContext
        )
        this.allTextDivs.push(this.scaleXText(textDivStyles))
        if (i === this.props.textContent.items.length - 1) {
          this.setState({
            readyToRenderText: true,
            noText: false
          })
        }
      })
    }
  }

  updateHighlights = (text, i) => {
    let el = <TextNode key={`textLine-${i}-page-${this.props.id}`} index={i} id={this.props.id} text={text} />
    this.props.annotations.forEach(anno => {
      if (anno.range.start.index === i || anno.range.end.index === i) {
        el = (
          <div key={`textLine-${i}-page-${this.props.id}`} style={text.style}>
            {text.str}
          </div>
        )
      } else {
        el = (
          <div key={`textLine-${i}-page-${this.props.id}`} style={text.style}>
            {text.str}
          </div>
        )
      }
    })
    return el
  }

  scaleXText = textContent => {
    const ctx = this.state.renderContext.canvasContext
    const viewport = this.state.renderContext.viewport
    ctx.font = `${textContent.style.fontSize}px ${textContent.style.fontFamily}`
    const fontWidth = ctx.measureText(textContent.str).width
    const scale = (textContent.width * viewport.scale) / fontWidth
    return { ...textContent, style: { ...textContent.style, transform: `scaleX(${scale})` } }
  }

  render() {
    const dims = {
      height: Math.floor(this.state.renderContext.viewport.height),
      width: Math.floor(this.state.renderContext.viewport.width)
    }

    const highlightStyle = {
      backgroundColor: `rgb(${251}, ${237}, ${158})`,
      opacity: 0.3,
      position: 'absolute'
    }

    const iconNavStyles = {
      backgroundColor: '#fe567b',
      height: 25,
      width: 25,
      position: 'absolute',
      cursor: 'pointer',
      zIndex: 5
    }

    return (
      <div
        data-page-number={this.props.id}
        style={dims}
        ref={this.pageRef}
        className="page"
        onMouseUp={this.onMouseUp}>
        {!this.state.readyToRenderText &&
        <FlexGrid container flex style={{ height: '100%' }} align="center" justify="center">
          <CircularLoader />
        </FlexGrid>}
        <div className="canvasWrapper" style={{ ...dims, position: 'relative' }}>
          <canvas {...this.state.canvasStyleSpecs} id={`page-${this.props.id}-canvas`} ref={this.canvasRef}>
            {this.state.renderContext.canvasContext && this.state.readyToRenderText && this.renderPage()}
          </canvas>
          {this.state.renderContext.canvasContext &&
          this.state.annotations.length > 0 &&
          this.state.annotations.map((annotation, i) => {
            return annotation.rects.map((rect, j) => {
              const highlight = rect.pdfPoints
              const vp = this.state.renderContext.viewport.convertToViewportRectangle([
                highlight.x, highlight.y, highlight.endX, highlight.endY
              ])
              const startPoint = dom_utils.applyTransform([
                highlight.x, highlight.y
              ], this.state.renderContext.viewport.transform)
              const endPoint = dom_utils.applyTransform([
                highlight.endX, highlight.endY
              ], this.state.renderContext.viewport.transform)

              const bounds = [...startPoint, ...endPoint]

              const left = Math.min(bounds[0], bounds[2]),
                top = Math.min(bounds[1], bounds[3]),
                width = Math.abs(bounds[0] - bounds[2]),
                height = Math.abs(bounds[1] - bounds[3])

              return (
                <Fragment key={`highlight-area-${i}-${j}`}>
                  <div
                    key={`highlight-${i}-${j}`}
                    style={{ left, top, height, width, ...highlightStyle }}
                  />
                  {j === annotation.rects.length - 1 &&
                  <>
                    <div
                      key={`highlight-${i}-${j}-cancel`}
                      style={{ ...iconNavStyles, left: endPoint[0] - 53, top: endPoint[1], marginTop: 1 }}>
                      <IconButton style={{ height: 25, width: 25 }}>close</IconButton>
                    </div>
                    <div
                      key={`highlight-${i}-${j}-confirm`}
                      style={{ ...iconNavStyles, left: endPoint[0] - 24, top: endPoint[1], marginTop: 1 }}>
                      <IconButton
                        style={{ height: 25, width: 25 }}
                        onClick={() => this.handleConfirmAnnotation(i)}>
                        done
                      </IconButton>
                    </div>
                  </>}
                </Fragment>
              )
            })
          })}
        </div>
        <div className="textLayer" id={`text-layer-page-${this.props.id}`} style={dims} ref={this.textLayerRef}>
          {this.state.readyToRenderText === true && this.allTextDivs.map((textLine, i) => {
            return this.updateHighlights(textLine, i)
          })}
        </div>
      </div>
    )
  }
}

const PageWithRef = React.forwardRef((props, ref) => <Page {...props} ref={ref} />)
export default PageWithRef