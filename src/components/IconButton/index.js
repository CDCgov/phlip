import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiIconButton } from 'material-ui/IconButton'
import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'

const IconButton = ({ color, onClick, iconSize, style, iconStyle, tooltipText, id, children, ...otherProps }) => {
  const styles = {
    width: iconSize,
    height: iconSize,
    ...style
  }

  const Button = (
    <MuiIconButton onClick={onClick} disableRipple style={styles} {...otherProps}>
      <Icon color={color} size={iconSize} style={iconStyle}>
        {children}
      </Icon>
    </MuiIconButton>
  )

  return tooltipText.length > 0
    ? <Tooltip id={id} text={tooltipText}>{Button}</Tooltip>
    : Button
}

IconButton.propTypes = {
  color: PropTypes.string,
  onClick: PropTypes.func,
  iconSize: PropTypes.number,
  style: PropTypes.object,
  iconStyle: PropTypes.object,
  tooltipText: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.node
}

IconButton.defaultProps = {
  color: 'white',
  iconSize: 24,
  tooltipText: ''
}

export default IconButton