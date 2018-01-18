import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from 'material-ui/Checkbox'
import { FormGroup, FormControlLabel } from 'material-ui/Form'
import { withStyles } from 'material-ui/styles';

const styles = {
  checked: {
    color: '#00a9e5'
  }
}

export const CheckboxGroup = ({ choices, onChange, classes }) => {
  return (
    <FormGroup>
      {choices.map(choice => (
        <FormControlLabel
          key={choice.id}
          control={
            <Checkbox
              checked={choices.checked}
              onChange={onChange(choice.id)}
              value={`${choice.id}`}
              classes={{
                checked: classes.checked
              }}
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

export default withStyles(styles)(CheckboxGroup)