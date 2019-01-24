import React from 'react'
import PropTypes from 'prop-types'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  checked: {
    color: theme.palette.secondary.main
  }
})

/**
 * Simple checkbox input type and label
 */
export const CheckboxLabel = ({ input, label, classes, disabled }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={!!input.value}
          classes={{ checked: classes.checked }}
          disabled={disabled}
          onChange={input.onChange}
        />
      }
      label={label}
    />
  )
}

CheckboxLabel.propTypes = {
  /**
   * Input object, contains value and onChange
   */
  input: PropTypes.object,
  /**
   * Input label for checkbox
   */
  label: PropTypes.any,
  /**
   * Style classes (comes from @material-ui/core)
   */
  classes: PropTypes.object,
  /**
   * Whether or not the checkbox should be disabled
   */
  disabled: PropTypes.bool
}

export default withStyles(styles)(CheckboxLabel)