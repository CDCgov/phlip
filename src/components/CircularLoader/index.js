import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'

/**
 * Spinning loader, based on @material-ui/core's CircularProgress
 */
export const CircularLoader = ({ type, color, thickness, ...otherProps }) => {
  return <CircularProgress type={type} color={color} thickness={thickness} {...otherProps} />
}

CircularLoader.defaultProps = {
  type: 'indeterminate',
  color: 'primary',
  thickness: 5
}

CircularLoader.propTypes = {
  /**
   * Type of loader: determinate, indeterminate
   */
  type: PropTypes.string,
  /**
   * Color of the spinning loader ring
   */
  color: PropTypes.string,
  /**
   * Thickness of spinner
   */
  thickness: PropTypes.number
}

export default CircularLoader
