import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Radio, { RadioGroup as MuiRadioGroup } from 'material-ui/Radio'
import { FormControlLabel, FormControl, FormGroup } from 'material-ui/Form'
import { withStyles } from 'material-ui/styles'
import SimpleInput from 'components/SimpleInput'

const styles = {
  checked: {
    color: '#00a9e5'
  }
}

export const RadioGroup = ({ choices, userAnswer, onChange, onChangePincite, classes }) => {
  return (
    <FormControl component="fieldset">
    <FormGroup>
      {choices.map(choice => (
        <div key={choice.id} style={{ display: 'flex', alignItems: 'center'  }}>
          <FormControlLabel
            onChange={onChange(choice.id)}
            checked={userAnswer[choice.id].checked === true}
            control={
              <Radio classes={{ checked: classes.checked }} />
            }
            label={choice.text}
          />
          {userAnswer[choice.id].checked === true &&
          <SimpleInput key={`${choice.id}-pincite`} placeholder="Enter pincite" value={choice.pincite} onChange={onChangePincite(choice.id, 'pincite')} />}
        </div>
      ))}
    </FormGroup>
    </FormControl>
  )
}

RadioGroup.propTypes = {
}

export default withStyles(styles)(RadioGroup)