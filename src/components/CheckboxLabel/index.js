import React from 'react'
import PropTypes from 'prop-types'
import { FormControlLabel } from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'

const CheckboxLabel = ({ input, label, onChange }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={input.value ? true : false}
          onChange={input.onChange}
        />
      }
      label={label}
    />
  )
}

export default CheckboxLabel