import React from 'react'
import PropTypes from 'prop-types'
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  disabled: {
    color: 'black'
  },
  disabledLabel: {
    color: 'rgba(0,0,0,.42)'
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

/**
 * Basic dropdown component, can be used with ReduxForm `<Field />` component
 */
export const Dropdown = props => {
  const {
    input, label, id, defaultValue, classes, shrinkLabel,
    disabled, meta: { touched, error }, options, required, ...otherProps
  } = props

  const menuItems = options.map(option => (
    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
  ))

  return (
    <FormControl style={{ minWidth: '120px' }}>
      <InputLabel
        htmlFor={id}
        shrink={shrinkLabel}
        required={required}>{label}</InputLabel>
      <Select
        input={<Input id={id} />}
        value={input.value ? input.value : defaultValue}
        onChange={event => input.onChange(event.target.value)}
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
  /**
   * Input object, has property 'value' and 'onChange'
   */
  input: PropTypes.object,

  /**
   * Input label for dropdown
   */
  label: PropTypes.string,

  /**
   * ID of dropdown input
   */
  id: PropTypes.any,

  /**
   * Default value for the dropdown
   */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Style classes object from @material-ui/core
   */
  classes: PropTypes.object,

  /**
   * Whether or not to shrink the input label
   */
  shrinkLabel: PropTypes.bool,

  /**
   * Whether or not the dropdown input is disabled
   */
  disabled: PropTypes.bool,

  /**
   * @ignore
   */
  meta: PropTypes.object,

  /**
   * List of options for the dropdown
   */
  options: PropTypes.arrayOf(PropTypes.object),

  /**
   * Is the input dropdown required
   */
  required: PropTypes.bool
}

Dropdown.defaultProps = {
  shrinkLabel: true,
  required: false,
  options: [],
  meta: { touched: false, error: undefined }
}

export default withStyles(styles)(Dropdown)