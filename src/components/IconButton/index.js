import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiIconButton } from 'material-ui/IconButton'
import Icon from 'components/Icon'

const IconButton = ({ color, onClick, iconSize, children, style, iconStyle, ...otherProps }) => {
  return (
    <MuiIconButton onClick={onClick} disableRipple
                   style={{ width: iconSize, height: iconSize, ...style }} {...otherProps}>
      <Icon color={color} size={iconSize} style={iconStyle}>
        {children}
      </Icon>
    </MuiIconButton>
  )
}

IconButton.propTypes = {
  color: PropTypes.string,
  onClick: PropTypes.func,
  iconSize: PropTypes.number,
  children: PropTypes.node
}

IconButton.defaultProps = {
  color: 'white',
  iconSize: 24
}

export default IconButton