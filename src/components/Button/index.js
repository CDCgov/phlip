import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiButton } from 'material-ui/Button'
import { withTheme } from 'material-ui/styles'

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
  value: PropTypes.any,
  color: PropTypes.string,
  onClick: PropTypes.func,
  raised: PropTypes.bool,
  theme: PropTypes.object,
  listButton: PropTypes.bool,
  disabled: PropTypes.bool
}

Button.defaultProps = {
  raised: true,
  color: 'primary',
  listButton: false,
  disabled: false
}

export default withTheme()(Button)