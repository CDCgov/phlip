import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { transformText } from './textTransformHelpers'
import * as ui_utils from 'pdfjs-dist/lib/web/ui_utils'
import { Util as dom_utils } from 'pdfjs-dist/lib/shared/util'
import { AnnotationLayer } from 'pdfjs-dist/lib/display/annotation_layer'
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
    this.annotationLayerRef = React.createRef()
    this.mouseArea = {
      x: 0,
      y: 0,
      startX: 0,
      startY: 0
    }

    this.selectedArea = null

    this.state = {
      renderContext: {
        viewport: {
          width: props.viewerDimensions.width,
          height: props.viewerDimensions.height
        }
      },
      rendering: false,
      renderToRenderText: false,
      canvasStyleSpecs: {},
      textLineStyleSpecs: {},
      noText: false,
      selectionStyle: {},
      highlights: []
    }

    this.allTextDivs = []
  }

  componentDidMount() {
    this.setCanvasSpecs()
    this.annotationParameters = {
      annotations: []
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.allowSelection === false && this.props.allowSelection === true) {
      this.startCanvasListeners()
    }
  }

  startCanvasListeners() {
    this.selectedArea = null
    const rects = this.pageRef.current.getClientRects()[0]
    this.mouseArea = {
      x: 0,
      y: 0,
      startX: 0,
      startY: 0,
      pageOffsetX: rects.x,
      pageOffsetY: rects.y
    }
  }

  onMouseUp = e => {
    const color = new Uint8ClampedArray()
    color[0] = 251
    color[1] = 237
    color[2] = 158

    if (this.props.allowSelection) {
      const range = document.getSelection().getRangeAt(0)
      const pageRect = this.textLayerRef.current.getClientRects()[0]
      const selectionRects = range.getClientRects()
      const viewport = this.state.renderContext.viewport
      console.log(this.state.renderContext)

      let selected = []
      for (let i = 0; i < selectionRects.length; i++) {
        const r = selectionRects[i]
        selected[i] = viewport.convertToPdfPoint(r.left - pageRect.x, r.top - pageRect.y)
        .concat(viewport.convertToPdfPoint(r.right - pageRect.x, r.bottom - pageRect.y))

        console.log('selected[i]', selected[i])

        const start = dom_utils.applyInverseTransform([
          r.left - pageRect.left, r.top - pageRect.top
        ], this.state.renderContext.viewport.transform)

        const end = dom_utils.applyInverseTransform([
          r.right - pageRect.left, r.bottom - pageRect.top
        ], this.state.renderContext.viewport.transform)

        console.log(start, end)

        const annotation = {
          annotationFlags: 4,
          annotationType: 9,
          subtype: 'Highlight',
          color,
          hasAppearance: true,
          isRenderable: true,
          hasPopup: true,
          contents: 'contents',
          title: 'title',
          rect: selected[i],
          id: i,
          borderStyle: {
            dashArray: [3],
            horizontalCornerRadius: 0,
            style: 1,
            verticalCornerRadius: 0,
            width: 0
          }
        }

        this.annotationParameters.annotations.push(annotation)
      }
      AnnotationLayer.render({
        ...this.annotationParameters,
        div: this.annotationLayerRef.current,
        page: this.props.page,
        viewport: this.state.renderContext.viewport
      })
    }
  }

  onMouseMove = e => {
    this.mouseArea.x = e.pageX - this.mouseArea.pageOffsetX
    this.mouseArea.y = e.pageY - this.mouseArea.pageOffsetY

    if (this.selectedArea !== null) {
      this.setState({
        selectionStyle: {
          ...this.state.selectionStyle,
          width: Math.abs(this.mouseArea.x - this.mouseArea.startX),
          height: Math.abs(this.mouseArea.y - this.mouseArea.startY),
          left: (this.mouseArea.x - this.mouseArea.startX < 0)
            ? this.mouseArea.x
            : this.mouseArea.startX,
          top: (this.mouseArea.y - this.mouseArea.startY < 0)
            ? this.mouseArea.y
            : this.mouseArea.startY
        }
      })
    }
  }

  onCanvasClick = () => {
    if (this.selectedArea === null) {
      this.mouseArea.startX = this.mouseArea.x
      this.mouseArea.startY = this.mouseArea.y
      this.selectedArea = true
      this.setState({
        selectionStyle: {
          ...this.state.selectionStyle,
          left: this.mouseArea.startX,
          top: this.mouseArea.startY
        }
      })
    } else {
      this.selectedArea = null
      let startCoords = [this.mouseArea.startX, this.mouseArea.startY], endCoords = [this.mouseArea.x, this.mouseArea.y]

      if (this.mouseArea.startX > this.mouseArea.x) {
        startCoords = [this.mouseArea.x, this.mouseArea.y]
        endCoords = [this.mouseArea.startX, this.mouseArea.startY]
      }

      const pdfPoint = dom_utils.applyInverseTransform(startCoords, this.state.renderContext.viewport.transform)
      const endPdfPoint = dom_utils.applyInverseTransform(endCoords, this.state.renderContext.viewport.transform)

      const captureArea = {
        pageNumber: this.props.id,
        x: pdfPoint[0],
        y: pdfPoint[1],
        endX: endPdfPoint[0],
        endY: endPdfPoint[1]
      }

      this.setState({
        highlights: [
          ...this.state.highlights,
          captureArea
        ],
        selectionStyle: {}
      })

      this.props.captureArea(captureArea)
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

  updateAnnotations = annotations => {
    annotations.map(annotation => {

    })
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

  onHoverOverSelection = (e) => {
    e.preventDefault()
    this.onMouseMove(e)
  }

  onMouseDown = e => {
    console.log(e)
    this.mouseArea.startX = e.pageX - this.mouseArea.pageOffsetX
    this.mouseArea.startY = e.pageY - this.mouseArea.pageOffsetY
  }

  render() {
    const dims = {
      height: Math.floor(this.state.renderContext.viewport.height),
      width: Math.floor(this.state.renderContext.viewport.width)
    }

    const baseSelectionStyles = {
      borderRadius: 4,
      position: 'absolute',
      border: '2px dashed #c4ca3b'
    }

    const highlightStyle = {
      backgroundColor: '#f0fe3a',
      opacity: 0.3,
      borderRadius: 4,
      position: 'absolute',
      border: '1px solid #c4ca3b'
    }

    const iconNavStyles = {
      backgroundColor: '#fe567b',
      height: 25,
      width: 25,
      position: 'absolute'
    }

    return (
      <div
        data-page-number={this.props.id}
        style={dims}
        ref={this.pageRef}
        className="page"
        onMouseMove={this.props.allowSelection === true ? (e) => this.onMouseMove(e) : null}
        onMouseDown={this.props.allowSelection === true ? e => this.onMouseDown(e) : null}
        onMouseUp={this.onMouseUp}>
        {this.state.readyToRenderText === false &&
        <FlexGrid container flex style={{ height: '100%' }} align="center" justify="center">
          <CircularLoader />
        </FlexGrid>}
        <div className="canvasWrapper" style={{ ...dims, position: 'relative' }}>
          <canvas
            {...this.state.canvasStyleSpecs}
            style={{
              cursor: this.props.allowSelection
                ? 'crosshair'
                : 'default',
              ...this.state.canvasStyleSpecs.style
            }}
            id={`page-${this.props.id}-canvas`}
            ref={this.canvasRef}>
            {this.state.renderContext.canvasContext && this.state.readyToRenderText === true && this.renderPage()}
          </canvas>
          {this.state.renderContext.canvasContext && this.props.annotations.length > 0 &&
          this.props.annotations.map((annotation, i) => {
            const highlight = annotation.pdfPoint
            const startPoint = dom_utils.applyTransform([
              highlight.x, highlight.y
            ], this.state.renderContext.viewport.transform)
            const endPoint = dom_utils.applyTransform([
              highlight.endX, highlight.endY
            ], this.state.renderContext.viewport.transform)
            const left = startPoint[0], top = startPoint[1], height = endPoint[1] - startPoint[1],
              width = endPoint[0] - startPoint[0]

            return (
              <Fragment key={`highlight-area-${i}`}>
                <div
                  key={`highlight-${i}`}
                  style={{ left, top, height, width, ...highlightStyle }}
                />
                <div
                  key={`highlight-${i}-cancel`}
                  style={{ ...iconNavStyles, left: endPoint[0] - 53, top: endPoint[1], marginTop: 1 }}>
                  <IconButton style={{ height: 25, width: 25 }}>
                    close
                  </IconButton>
                </div>
                <div
                  key={`highlight-${i}-confirm`}
                  style={{ ...iconNavStyles, left: endPoint[0] - 24, top: endPoint[1], marginTop: 1 }}>
                  <IconButton style={{ height: 25, width: 25 }}>done</IconButton>
                </div>
              </Fragment>
            )
          })}
          {this.props.allowSelection &&
          <div
            style={{ ...this.state.selectionStyle, ...baseSelectionStyles }}
            onMouseMove={this.onHoverOverSelection}
          />}
        </div>
        <div className="textLayer" id={`text-layer-page-${this.props.id}`} style={dims} ref={this.textLayerRef}>
          {this.state.readyToRenderText === true && this.allTextDivs.map((textLine, i) => {
            return this.updateHighlights(textLine, i)
          })}
        </div>
        <div
          className="annotationLayer"
          id={`annotation-layer-page-${this.props.id}`}
          style={dims}
          ref={this.annotationLayerRef}>
        </div>
      </div>
    )
  }
}

const PageWithRef = React.forwardRef((props, ref) => <Page {...props} ref={ref} />)
export default PageWithRef