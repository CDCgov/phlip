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
        <Fragment key={choice.id}>
          <FormControlLabel
            control={
              <Checkbox
                checked={userAnswer[choice.id]}
                onChange={onChange}
                value={`${choice.id}`}
                classes={{
                  checked: classes.checked
                }}
              />
            }
            label={choice.text}
          />
          {choice.checked && <SimpleInput placeholder="Enter pincite" value={choice.pincite} onChange={onChangePincite} />}
        </Fragment>
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