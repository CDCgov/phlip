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
    this.props.saveAnnotation(index)
    this.setState({
      pending: false
    })
  }

  handleCancelAnnotation = index => {
    this.props.cancelAnnotation(index)
    this.setState({
      pending: false
    })
  }

  onMouseUp = () => {
    if (this.props.allowSelection && !this.state.pending) {
      if (document.getSelection().toString().length > 0) {
        this.props.getSelection(this.state.renderContext, this.props.id)
      }
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

  scaleXText = textContent => {
    const ctx = this.state.renderContext.canvasContext
    const viewport = this.state.renderContext.viewport
    ctx.font = `${textContent.style.fontSize}px ${textContent.style.fontFamily}`
    const fontWidth = ctx.measureText(textContent.str).width
    const scale = (textContent.width * viewport.scale) / fontWidth
    return { ...textContent, style: { ...textContent.style, transform: `scaleX(${scale})` } }
  }

  getBounds = points => {
    const highlight = points
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

    return { left, top, width, height, bounds }
  }

  render() {
    const dims = {
      height: Math.floor(this.state.renderContext.viewport.height),
      width: Math.floor(this.state.renderContext.viewport.width)
    }

    const highlightStyle = {
      //backgroundColor: `rgb(${251}, ${237}, ${158})`,
      backgroundColor: '#00e0ff',
      opacity: 0.2,
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
        ref={this.props.pageRef}
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
        </div>
        <div className="annotationLayer">
          {this.state.readyToRenderText && this.props.annotations.map((annotation, i) => {
            return annotation.rects.map((rect, j) => {
              const { left, top, height, width } = this.getBounds(rect.pdfPoints)
              return (
                <div
                  key={`highlight-${i}-${j}`}
                  style={{ left, top, height, width, ...highlightStyle }}
                />
              )
            })
          })}
          {this.state.renderContext.canvasContext &&
          this.props.pendingAnnotations.length > 0 &&
          this.props.pendingAnnotations.map((annotation, i) => {
            return annotation.rects.map((rect, j) => {
              const { left, top, height, width, bounds } = this.getBounds(rect.pdfPoints)
              return (
                <Fragment key={`pending-highlight-area-${i}-${j}`}>
                  <div
                    key={`pending-highlight-${i}-${j}`}
                    style={{ left, top, height, width, ...highlightStyle }}
                  />
                  {((j === annotation.rects.length - 1) && annotation.endPage === this.props.id) &&
                  <>
                    <div
                      key={`pending-highlight-${i}-${j}-cancel`}
                      style={{ ...iconNavStyles, left: bounds[2] - 53, top: bounds[3], marginTop: 1 }}>
                      <IconButton
                        style={{ height: 25, width: 25 }}
                        onClick={() => this.handleCancelAnnotation(i)}>
                        close
                      </IconButton>
                    </div>
                    <div
                      key={`pending-highlight-${i}-${j}-confirm`}
                      style={{ ...iconNavStyles, left: bounds[2] - 24, top: bounds[3], marginTop: 1 }}>
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
        <div
          data-page-number={this.props.id}
          className="textLayer"
          id={`text-layer-page-${this.props.id}`}
          style={dims}
          ref={this.textLayerRef}>
          {this.state.readyToRenderText === true && this.allTextDivs.map((textLine, i) => {
            return <TextNode key={`textLine-${i}-page-${this.props.id}`} index={i} id={this.props.id} text={textLine} />
          })}
        </div>
      </div>
    )
  }
}

const PageWithRef = React.forwardRef((props, ref) => <Page {...props} pageRef={ref} />)
export default PageWithRef