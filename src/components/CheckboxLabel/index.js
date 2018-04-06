import React from 'react'
import PropTypes from 'prop-types'
import { FormControlLabel } from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  checked: {
    color: theme.palette.secondary.main
  }
})

const CheckboxLabel = ({ input, label, onChange, classes, disabled }) => {
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

export default withStyles(styles)(CheckboxLabel)