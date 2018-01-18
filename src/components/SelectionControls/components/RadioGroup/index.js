import React from 'react'
import PropTypes from 'prop-types'
import Radio, { RadioGroup as MuiRadioGroup } from 'material-ui/Radio'
import { FormControlLabel } from 'material-ui/Form'


export const RadioGroup = ({ choices, onChange, selectedValue }) => {
  return (
    <MuiRadioGroup onChange={onChange} value={selectedValue}>
      {choices.map(choice => (
        <FormControlLabel key={choice.id} value={`${choice.id}`} control={<Radio />} label={choice.text} />
      ))}
    </MuiRadioGroup>
  )
}

RadioGroup.propTypes = {
  choices: PropTypes.array,
  onChange: PropTypes.func,
  selectedValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

export default RadioGroup