import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiButton } from 'material-ui/Button'
import { withTheme } from 'material-ui/styles'

const Button = ({ value, color, onClick, raised, theme, listButton, ...otherProps }) => {
  const style = {
    color: raised || listButton ? 'white' : color || '',
    fontWeight: 'lighter',
    backgroundColor: raised ? '' : listButton ? theme.buttons.listButtons : ''
  }
  return (
    <MuiButton raised={raised} color={color} onClick={onClick} style={style} {...otherProps}>{value}</MuiButton>
  )
}

Button.propTypes = {
  value: PropTypes.string,
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
  disabled: false,
}

export default withTheme()(Button)