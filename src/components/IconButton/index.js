import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiIconButton } from 'material-ui/IconButton'
import Icon from 'components/Icon'

const IconButton = ({ color, onClick, iconSize, children, style, ...otherProps }) => {
  return (
    <MuiIconButton onClick={onClick} disableRipple style={{ width: iconSize, height: iconSize, ...style }}>
      <Icon color={color} size={iconSize}>
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