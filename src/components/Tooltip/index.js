import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiTooltip } from 'material-ui/Tooltip'

export const Tooltip = ({ text, placement, children, ...otherProps }) => {
  return (
    <MuiTooltip placement={placement} title={text} enterDelay={8} {...otherProps}>
      {children}
    </MuiTooltip>
  )
}

Tooltip.defaultProps = {
  placement: 'top'
}

Tooltip.propTypes = {
  text: PropTypes.string,
  placement: PropTypes.string
}

export default Tooltip