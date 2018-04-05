import React from 'react'
import PropTypes from 'prop-types'
import Select from 'material-ui/Select'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { MenuItem } from 'material-ui/Menu'
import { withStyles } from 'material-ui/styles'
import Checkbox from 'material-ui/Checkbox'

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

const MultiSelectDropdown = props => {
  const {
    input, selected, label, id,
    classes, disabled, options, defaultValue,
    meta: { touched, error, active, warning }, ...otherProps } = props

  const menuItems = options.map(option => (
    <MenuItem key={option.value} value={option.value}>
      <Checkbox checked={selected.includes(option.value)} />{option.label}
    </MenuItem>
  ))

  return (
    <FormControl style={{ width: '100%' }} error={Boolean(touched && error && !active || warning)}>
      <InputLabel htmlFor={id} shrink={input.value.length > 0}>{label}</InputLabel>
      <Select
        {...input}
        multiple
        value={input.value || []}
        classes={{ disabled: classes.disabled, icon: disabled ? classes.disabledIcon : classes.icon }}
        disabled={disabled}
        children={menuItems}
        input={<Input id={id} />}
        onBlur={() => input.onBlur()}
        renderValue={selection => selection.join(', ')}
        {...otherProps}
      />
      {touched && error && !active && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}

MultiSelectDropdown.propTypes = {

}

MultiSelectDropdown.defaultProps = {}

export default withStyles(styles)(MultiSelectDropdown)