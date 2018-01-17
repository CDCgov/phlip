import React from 'react'
import PropTypes from 'prop-types'
import { FormControlLabel } from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'
import { withStyles } from 'material-ui/styles'

const styles = {
  checked: {
    color: '#3E91B8'
  },
};

const CheckboxLabel = ({ input, label, onChange, classes }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={input.value ? true : false}
          classes={{
            checked: classes.checked,
          }}
          onChange={input.onChange}
        />
      }
      label={label}
    />
  )
}

export default withStyles(styles)(CheckboxLabel)