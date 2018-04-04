import React from 'react'
import PropTypes from 'prop-types'
import Select from 'material-ui/Select'
import { InputLabel } from 'material-ui/Input'
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

const MultiSelectDropdown = ({ input, selected, label, onChange, id, defaultValue, classes, shrinkLabel, disabled, meta: { touched, error, active, warning }, options, ...otherProps }) => {
  let menuItems = options.map(option => (
    <MenuItem key={option.value} value={option.value}>
      <Checkbox checked={selected.includes(option.value)} />{option.label}
    </MenuItem>
  ))

  return (
    <FormControl style={{ minWidth: '120px' }} error={Boolean(touched && error && !active || warning)}>
      <InputLabel htmlFor={id} shrink={true}>{label}</InputLabel>
      <Select
        {...input}
        multiple
        value={selected}
        classes={{ disabled: classes.disabled, icon: disabled ? classes.disabledIcon : classes.icon }}
        disabled={disabled}
        children={menuItems}
        renderValue={selection => selection.join(', ')}
        fullWidth
        {...otherProps}
      />
      {touched && error && !active && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}

MultiSelectDropdown.propTypes = {}

MultiSelectDropdown.defaultProps = {}

export default withStyles(styles)(MultiSelectDropdown)