import React from 'react'
import PropTypes from 'prop-types'
import { CircularProgress } from 'material-ui/Progress'

export const CircularLoader = ({ type, color, ...otherProps }) => {
  return <CircularProgress type={type} color={color} {...otherProps} />
}

CircularLoader.defaultProps = {
  type: 'indeterminate',
  color: 'primary'
}

CircularLoader.propTypes = {
  type: PropTypes.string,
  color: PropTypes.string
}

export default CircularLoader