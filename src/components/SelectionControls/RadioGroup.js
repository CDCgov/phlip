import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Radio from 'material-ui/Radio'
import { FormControlLabel, FormControl, FormGroup } from 'material-ui/Form'
import { withStyles } from 'material-ui/styles'

const styles = {
  checked: {
    color: '#00a9e5'
  }
}

export const RadioGroup = ({ choices, selected, onChange, classes }) => {
  return (
    <FormControl component="fieldset">
      <FormGroup>
        {choices.map(choice => (
          <div key={choice.type} style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              onChange={onChange(choice.type)}
              checked={selected === choice.type}
              control={<Radio classes={{ checked: classes.checked }} />}
              label={choice.text}
            />
          </div>
        ))}
      </FormGroup>
    </FormControl>
  )
}

RadioGroup.propTypes = {
}

export default withStyles(styles)(RadioGroup)