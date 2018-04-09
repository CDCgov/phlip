import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'

const baseStyle = { flex: '1' }

export const Card = ({ children, style, ...otherProps }) => {
  return (
    <Paper style={{ ...baseStyle, ...style }} {...otherProps}>
      {children}
    </Paper>
  )
}

Card.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
}

export default Card