import React from 'react'
import PropTypes from 'prop-types'
import Radio from 'material-ui/Radio'
import Container, { Row, Column } from 'components/Layout'
import TextInput from 'components/TextInput'
import Checkbox from 'material-ui/Checkbox'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'

const SelectInput = ({ name, label, answerType, type, input, classes, meta: { asyncValidating, active, touched, error, warning }, ...custom }) => {
  //Refactor this 12/17/2018
  return (
    <Container>
      <Column style={{ marginTop: 8 }}>
        {(() => {
          switch (answerType) {
            case 1:
            case 4:
              return <Radio disabled />
              break;
            case 2:
            case 3:
              return <Checkbox disabled />
              break;

            default:
              break;
          }
        })()}
      </Column>
      <Column flex>
        <FormControl error={Boolean(touched && error && !active || warning)} fullWidth>
          <InputLabel htmlFor={name} shrink>{label}</InputLabel>
          <Input
            id={name}
            {...input}
            type={type}
            {...custom}
          />
          {touched && error && !active && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
      </Column>
    </Container>
  )
}


SelectInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  input: PropTypes.any,
  meta: PropTypes.object,
  multiline: PropTypes.bool
}

SelectInput.defaultProps = {
  meta: {}
}

export default SelectInput