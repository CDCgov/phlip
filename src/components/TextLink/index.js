import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withTheme } from 'material-ui/styles'

/**
 * Wrapper around react-router-dom's Link component, all Link props are passed through.
 * Text color is the apps secondary theme color
 */
export const TextLink = ({ theme, children, ...otherProps }) => {
  const styles = {
    color: theme.palette.secondary.main,
    textDecoration: 'none'
  }

  return (
    <Link {...otherProps} style={styles}>{children}</Link>
  )
}

TextLink.propTypes = {
  /**
   * Material-UI theme object
   */
  theme: PropTypes.object,
  /**
   * Link contents
   */
  children: PropTypes.any
}

export default withTheme()(TextLink)