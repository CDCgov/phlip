import React from 'react'
import PropTypes from 'prop-types'
import { FormControlLabel } from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'

const CheckboxLabel = ({ value, label, checked, onChange }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          value={value}
        />
      }
      label={label}
    />
  )
}

export default CheckboxLabel