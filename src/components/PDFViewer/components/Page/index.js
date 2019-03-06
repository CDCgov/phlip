import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as ui_utils from 'pdfjs-dist/lib/web/ui_utils'
import { CircularLoader, FlexGrid } from 'components'
import '../../pdf_viewer.css'
import TextNode from './components/TextNode'
import Annotation from './components/Annotation'

export class Page extends Component {
  static defaultProps = {
    annotations: [],
    pendingAnnotations: [],
    allowSelection: false,
    textContent: {
      items: []
    },
    deleteAnnotationIndex: null
  }

  static propTypes = {
    annotations: PropTypes.array,
    allowSelection: PropTypes.bool,
    textContent: PropTypes.object,
    pendingAnnotations: PropTypes.array,
    saveAnnotation: PropTypes.func,
    cancelAnnotation: PropTypes.func,
    getSelection: PropTypes.func,
    id: PropTypes.number,
    viewerDimensions: PropTypes.shape({
      height: PropTypes.number,
      width: PropTypes.number
    }),
    showDeleteIcon: PropTypes.func,
    hideDeleteIcon: PropTypes.func,
    deleteAnnotationIndex: PropTypes.number,
    confirmRemoveAnnotation: PropTypes.func
  }

  constructor(props, context) {
    super(props, context)

    this.shouldRerenderPdf = true
    this.canvasRef = React.createRef()

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
      noText: false,
      selectionStyle: {},
      pending: false
    }
  }

  componentDidMount() {
    this.setCanvasSpecs()
  }

  /**
   * User confirmed / saved pending annotation
   * @param index
   */
  onConfirmAnnotation = index => {
    this.props.saveAnnotation(this.props.pendingAnnotations[index].mainListIndex)
  }

  /**
   * User canceled pending annotation
   * @param index
   */
  onCancelAnnotation = index => {
    this.props.cancelAnnotation(this.props.pendingAnnotations[index].mainListIndex)
  }

  /**
   * Open an alert asking the user to confirm deleting an annotation
   * @param index
   */
  confirmRemoveAnnotation = index => {
    this.props.confirmRemoveAnnotation(this.props.annotations[index].fullListIndex)
  }

  /**
   * A user clicked a saved annotation, so need to show the 'delete' icon
   * @param index
   */
  onClickAnnotation = index => {
    if (this.props.deleteAnnotationIndex !== null) {
      this.props.hideDeleteIcon()
    } else {
      this.props.showDeleteIcon(this.props.id, this.props.annotations[index].endPage, index)
    }
  }

  /**
   * Used to determine if the user has selected text
   */
  onMouseUp = () => {
    if (this.props.allowSelection && this.props.pendingAnnotations.length === 0) {
      if (document.getSelection().toString().length > 0 && document.getSelection().rangeCount > 0) {
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

  /**
   * Indicates that the app can go ahead and start rendering text lines
   */
  generateTextElements = () => {
    this.setState({
      noText: this.props.textContent.items.length === 0,
      readyToRenderText: true
    })
  }

  render() {
    const { annotations, pendingAnnotations, pageRef, id, textContent, deleteAnnotationIndex } = this.props
    const { readyToRenderText, canvasStyleSpecs, renderContext } = this.state

    const dims = {
      height: Math.ceil(renderContext.viewport.height),
      width: Math.ceil(renderContext.viewport.width)
    }

    return (
      <div
        data-page-number={id}
        style={dims}
        ref={pageRef}
        className="page"
        onMouseUp={this.onMouseUp}>
        {!readyToRenderText &&
        <FlexGrid container flex style={{ height: '100%' }} align="center" justify="center">
          <CircularLoader />
        </FlexGrid>}
        <div className="canvasWrapper" style={{ ...dims, position: 'relative' }}>
          <canvas {...canvasStyleSpecs} id={`page-${id}-canvas`} ref={this.canvasRef}>
            {renderContext.canvasContext && readyToRenderText && this.renderPage()}
          </canvas>
        </div>
        <div className="annotationLayer" data-page-number={id} id={`page-${id}-annotations`} style={dims}>
          {readyToRenderText && annotations.map((annotation, i) => {
            return (
              <Annotation
                key={`highlight-area-${i}`}
                annotation={annotation}
                index={i}
                pageNumber={id}
                handleClickAnnotation={this.onClickAnnotation}
                handleRemoveAnnotation={this.confirmRemoveAnnotation}
                pending={false}
                isClicked={deleteAnnotationIndex === i}
                transform={renderContext.viewport.transform}
              />
            )
          })}
          {renderContext.canvasContext && pendingAnnotations.map((annotation, i) => {
            return (
              <Annotation
                key={`pending-highlight-area-${i}`}
                annotation={annotation}
                index={i}
                pageNumber={id}
                handleCancelAnnotation={this.onCancelAnnotation}
                handleConfirmAnnotation={this.onConfirmAnnotation}
                transform={renderContext.viewport.transform}
                pending
              />
            )
          })}
        </div>
        <div data-page-number={id} className="textLayer" id={`text-layer-page-${id}`} style={dims}>
          {readyToRenderText && textContent.items.map((textLine, i) => {
            return (
              <TextNode
                key={`textLine-${i}-page-${id}`}
                textItem={textLine}
                allStyles={textContent.styles}
                viewport={renderContext.viewport}
                canvasContext={renderContext.canvasContext}
              />
            )
          })}
        </div>
      </div>
    )
  }
}

const PageWithRef = React.forwardRef((props, ref) => <Page {...props} pageRef={ref} />)
export default PageWithRef
