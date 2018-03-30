import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withTheme } from 'material-ui/styles'

const TextLink = ({ theme, children, ...otherProps }) => {
  const styles = {
    color: theme.palette.secondary.main,
    textDecoration: 'none'
  }

  return (
    <Link {...otherProps} style={styles}>{children}</Link>
  )
}

TextLink.propTypes = {
  theme: PropTypes.object, 
  children: PropTypes.any
}

export default withTheme()(TextLink)