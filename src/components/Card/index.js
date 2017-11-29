import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'

const baseStyle = {
  flex: '1'
}

const Card = ({ children, style }) => {
  return (
    <Paper style={{ ...baseStyle, ...style }}>
      {children}
    </Paper>
  )
}

Card.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
}

export default Card