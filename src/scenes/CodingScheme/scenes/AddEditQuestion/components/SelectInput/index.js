import React from 'react'
import PropTypes from 'prop-types'
import Radio from 'material-ui/Radio'
import Container, { Row, Column } from 'components/Layout'
import TextInput from 'components/TextInput'
import Checkbox from 'material-ui/Checkbox'

const SelectInput = ({ name, label, answerType, type, input, meta: { asyncValidating, active, touched, error, warning }, ...custom }) => {
  return (
    <Container>
      <Column >
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
      <Column flex >
        <TextInput
          name={name}
          label={label}
          type={type}
          input={input}
          {...custom} />
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
  // radio: false,
  meta: {}
}

export default SelectInput