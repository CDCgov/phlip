import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiButton } from 'material-ui/Button'
import { withTheme } from 'material-ui/styles'

/**
 * Basic button based on material-ui
 */
export const Button = ({ value, color, onClick, raised, theme, listButton, style, ...otherProps }) => {
  const styles = {
    color: (raised || listButton)
      ? 'white'
      : color || '',
    fontWeight: 400,
    backgroundColor: raised
      ? ''
      : listButton
        ? theme.palette.primary.light
        : '',
    ...style
  }

  return (
    <MuiButton raised={raised} color={color} onClick={onClick} style={styles} {...otherProps}>{value}</MuiButton>
  )
}

Button.propTypes = {
  /**
   * Content of the button
   */
  value: PropTypes.any,

  /**
   * Color of the button
   */
  color: PropTypes.string,

  /**
   * Handles when the button is clicked
   */
  onClick: PropTypes.func,

  /**
   * Whether or not the button is a raised button
   */
  raised: PropTypes.bool,

  /**
   * Project theme provided by material-ui
   */
  theme: PropTypes.object,

  /**
   * Is the button displayed in a list? List buttons have a particular style
   */
  listButton: PropTypes.bool,

  /**
   * Is the button disabled
   */
  disabled: PropTypes.bool
}

Button.defaultProps = {
  raised: true,
  color: 'primary',
  listButton: false,
  disabled: false
}

export default withTheme()(Button)