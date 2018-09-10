import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiButton } from '@material-ui/core/Button'
import { withTheme } from '@material-ui/core/styles'

/**
 * Basic button based on @material-ui/core
 */
export const Button = ({ value, color, onClick, raised, theme, listButton, style, ...otherProps }) => {
  const buttonColor = color === 'accent' ? 'secondary' : color

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

  const variant = raised ? 'raised' : 'text'

  return (
    <MuiButton variant={variant} color={buttonColor} onClick={onClick} style={styles} {...otherProps}>{value}</MuiButton>
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
   * Project theme provided by @material-ui/core
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