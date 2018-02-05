import React from 'react'
import PropTypes from 'prop-types'
import Select from 'material-ui/Select'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import { MenuItem } from 'material-ui/Menu'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  disabled: {
    color: 'black'
  },

  disabledIcon: {
    display: 'none'
  },

  icon: {
    position: 'absolute',
    right: 0,
    top: 4,
    color: theme.palette.text.secondary,
    'pointer-events': 'none'
  }
})

const Dropdown = ({ input, label, id, defaultValue, classes, disabled, meta: { touched, error }, options, ...otherProps }) => {
  let menuItems = options.map(option => (
    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
  ))

  return (
    <FormControl style={{ minWidth: '120px' }}>
      <InputLabel htmlFor={id} shrink={true}>{label}</InputLabel>
      <Select
        input={<Input id={id} />}
        value={(input.value ? input.value : defaultValue)}
        onChange={(event) => (input.onChange(event.target.value))}
        classes={{
          disabled: classes.disabled,
          icon: disabled ? classes.disabledIcon : classes.icon
        }}
        disabled={disabled}
        children={menuItems}
        {...otherProps}
      />
    </FormControl>
  )
}

Dropdown.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  id: PropTypes.any,
  onChange: PropTypes.func,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  meta: PropTypes.object,
  options: PropTypes.arrayOf(PropTypes.object)
}

export default withStyles(styles)(Dropdown)