import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Checkbox from 'material-ui/Checkbox'
import { FormGroup, FormControlLabel, FormControl } from 'material-ui/Form'
import { withStyles } from 'material-ui/styles'
import SimpleInput from 'components/SimpleInput'

const styles = {
  checked: {
    color: '#00a9e5'
  }
}

export const CheckboxGroup = ({ choices, userAnswer, onChange, onChangePincite, classes }) => {
  return (
    <FormControl component="fieldset">
      <FormGroup>
        {choices.map(choice => (
          <div key={choice.id} style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              checked={userAnswer[choice.id].checked === true}
              onChange={onChange(choice.id)}
              control={
                <Checkbox classes={{ checked: classes.checked }} />
              }
              label={choice.text}
            />
            {userAnswer[choice.id].checked === true &&
            <SimpleInput key={`${choice.id}-pincite`} placeholder="Enter pincite" value={choice.pincite}
                         onChange={onChangePincite(choice.id, 'pincite')} />}
          </div>
        ))}
        </FormGroup>
    </FormControl>
  )
}

CheckboxGroup.propTypes = {
  choices: PropTypes.array,
  onChange: PropTypes.func
}

export default withStyles(styles)(CheckboxGroup)