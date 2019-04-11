import React, { Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { IconButton, Avatar } from 'components'
import { Util as dom_utils } from 'pdfjs-dist/lib/shared/util'
import { connect } from 'react-redux'

export class Annotation extends PureComponent {
  static defaultProps = {
    showAvatar: false
  }

  static propTypes = {
    annotation: PropTypes.object,
    index: PropTypes.number,
    pageNumber: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    pending: PropTypes.bool,
    isClicked: PropTypes.bool,
    handleConfirmAnnotation: PropTypes.func,
    handleCancelAnnotation: PropTypes.func,
    handleRemoveAnnotation: PropTypes.func,
    handleClickAnnotation: PropTypes.func,
    transform: PropTypes.array,
    showAvatar: PropTypes.bool,
    users: PropTypes.object
  }

  constructor(props, context) {
    super(props, context)
  }

  shouldShowActions = rectIndex => {
    const { annotation, pageNumber, pending, isClicked } = this.props
    return ((rectIndex === annotation.rects.length - 1) && annotation.endPage === pageNumber)
      ? pending
        ? true
        : isClicked
      : false
  }

  getBounds = points => {
    const highlight = points
    const startPoint = dom_utils.applyTransform([highlight.x, highlight.y], this.props.transform)
    const endPoint = dom_utils.applyTransform([highlight.endX, highlight.endY], this.props.transform)

    const bounds = [...startPoint, ...endPoint]

    const left = Math.min(bounds[0], bounds[2]),
      top = Math.min(bounds[1], bounds[3]),
      width = Math.abs(bounds[0] - bounds[2]),
      height = Math.abs(bounds[1] - bounds[3])

    return { left, top, width, height, bounds }
  }

  render() {
    const {
      annotation, index, pending, handleConfirmAnnotation, handleCancelAnnotation, handleRemoveAnnotation,
      handleClickAnnotation, showAvatar, user
    } = this.props

    const key = `${pending ? 'pending' : 'saved'}-highlight-area-${index}`

    return annotation.rects.map((rect, j) => {
      const { left, top, height, width, bounds } = this.getBounds(rect.pdfPoints)
      const iconStyle = { height: 25, width: 25, borderRadius: 0 }

      const avatarLocation = {
        left: left - 30,
        top: top - 30,
        position: 'absolute',
        width: 36,
        zIndex: 4
      }

      const iconLocation = {
        left: pending ? bounds[2] - 53 : bounds[2] - 24,
        top: bounds[3],
        marginTop: 1,
        width: pending ? 50 : 25,
        borderRadius: '0 0 5px 5px',
        border: '1px solid #d15d76'
      }

      return (
        <Fragment key={`${key}-${j}`}>
          {(j === 0 && showAvatar) &&
          <div style={avatarLocation}>
            <Avatar
              cardAvatar
              initials={user.initials}
              avatar={user.avatar}
              style={{ width: 30, height: 30 }}
              userName={user.username}
            />
          </div>}
          <div
            style={{ left, top, height, width }}
            className="highlight"
            onClick={() => pending ? null : handleClickAnnotation(index)}
          />
          {this.shouldShowActions(j) &&
          <div key={`${key}-${index}-${j}-actions`} className="iconActions" style={iconLocation}>
            <IconButton
              style={iconStyle}
              onClick={() => pending ? handleCancelAnnotation(index) : handleRemoveAnnotation(index)}>
              close
            </IconButton>
            {pending &&
            <IconButton
              style={{ borderLeft: '1px solid #d15d76', ...iconStyle }}
              onClick={() => handleConfirmAnnotation(index)}>
              done
            </IconButton>}
          </div>
          }
        </Fragment>
      )
    })
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    user: state.data.user.byId[ownProps.annotation.userId]
  }
}

export default connect(mapStateToProps)(Annotation)
