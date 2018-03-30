import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Checkbox from 'material-ui/Checkbox'
import { FormGroup, FormControlLabel, FormControl } from 'material-ui/Form'
import { withStyles } from 'material-ui/styles'
import SimpleInput from 'components/SimpleInput'

const styles = theme => ({
  checked: {
    color: theme.palette.secondary.main
  }
})

export const CheckboxGroup = ({ choices, userAnswers, onChange, onChangePincite, pincites, classes, mergedUserQuestions }) => {
  return (
    <FormControl component="fieldset">
      <FormGroup>
        {choices.map(choice => {
          return (<div key={choice.id} style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              checked={userAnswers.answers.hasOwnProperty(choice.id)}
              onChange={onChange(choice.id)}
              control={
                <Checkbox classes={{ checked: classes.checked }} />
              }
              label={choice.text}
            />
            {userAnswers.answers.hasOwnProperty(choice.id) && pincites &&
              <SimpleInput
                key={`${choice.id}-pincite`} style={{ width: 300 }} placeholder="Enter pincite"
                value={userAnswers.answers[choice.id].pincite}
                onChange={onChangePincite(choice.id, 'pincite')}
              />}
          </div>)
        })}
      </FormGroup>
    </FormControl>
  )
}

CheckboxGroup.defaultProps = {
  pincites: true
}

CheckboxGroup.propTypes = {
  choices: PropTypes.array,
  onChange: PropTypes.func
}

export default withStyles(styles)(CheckboxGroup)