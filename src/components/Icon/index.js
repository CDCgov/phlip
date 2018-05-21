import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiIcon } from 'material-ui/Icon'
import { withTheme } from 'material-ui/styles'

/**
 * Basic material-ui icon component
 */
const Icon = ({ color, size, style, children, theme, ...otherProps }) => {
  const styles = {
    fontSize: size, 
    color: theme.palette[color] ? theme.palette[color][500] : color,
    ...style
  }
  
  return (
    <MuiIcon
      style={styles}
      {...otherProps}
    >
      {children}
    </MuiIcon>
  )
}

Icon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  children: PropTypes.node,
  theme: PropTypes.object
}

Icon.defaultProps = {
  size: '24px',
  color: 'primary'
}

export default withTheme()(Icon)