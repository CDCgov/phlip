import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from 'material-ui/Checkbox'
import { FormGroup, FormControlLabel } from 'material-ui/Form'

export const CheckboxGroup = ({ choices, onChange }) => {
  return (
    <FormGroup>
      {choices.map(choice => (
        <FormControlLabel
          control={
            <Checkbox
              checked={choices.checked}
              onChange={onChange(choice.id)}
              value={choice.id}
            />
          }
          label={choice.text}
        />
      ))}
    </FormGroup>
  )
}

CheckboxGroup.propTypes = {
  choices: PropTypes.array,
  onChange: PropTypes.func
}

export default CheckboxGroup