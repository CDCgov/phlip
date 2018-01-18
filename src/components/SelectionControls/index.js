import React from 'react'
import PropTypes from 'prop-types'
import { FormControl } from 'material-ui/Form'
import RadioGroup from './components/RadioGroup'
import CheckboxGroup from './components/CheckboxGroup'

const SelectionControls = ({ type, choices, onChange, selectedValue }) => {
  return (
    <FormControl component="fieldset">
      {(type === 1 || type === 4) && <RadioGroup choices={choices} selectedValue={selectedValue} onChange={onChange} />}
      {type === 3 && <CheckboxGroup choices={choices} onChange={onChange} />}
    </FormControl>
  )
}

SelectionControls.propTypes = {
  type: PropTypes.number,
  choices: PropTypes.array,
  onChange: PropTypes.func,
  selectedValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

export default SelectionControls