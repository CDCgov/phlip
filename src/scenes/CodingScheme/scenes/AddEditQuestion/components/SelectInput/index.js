import React from 'react'
import PropTypes from 'prop-types'
import Radio from 'material-ui/Radio'
import Container, { Row, Column } from 'components/Layout'
import TextInput from 'components/TextInput'
import Checkbox from 'material-ui/Checkbox'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import IconButton from 'components/IconButton'
import * as questionTypes from '../../constants'
import Icon from 'components/Icon'

const SelectInput = ({ name, label, answerType, type, input, classes, index, currentValue, meta: { asyncValidating, active, touched, error, warning, dirty }, handleDelete, handleUp, handleDown, fields, isEdit, ...custom }) => {
  return (
    <Container alignItems={'center'}>
      {answerType !== questionTypes.BINARY && <Column>
        <Row>
          {index - 1 >= 0
            ? <IconButton color="action" onClick={handleUp}>keyboard_arrow_up</IconButton>
            : <IconButton color="action" disabled onClick={handleUp}>keyboard_arrow_up</IconButton>}

        </Row>
        <Row>
          {index + 1 == fields.length
            ? <IconButton color="action" disabled onClick={handleDown}>keyboard_arrow_down</IconButton>
            : <IconButton color="action" onClick={handleDown}>keyboard_arrow_down</IconButton>}
        </Row>
      </Column>}
      <Column style={{ marginTop: 8 }}>
        {(() => {
          switch (answerType) {
            case questionTypes.BINARY:
            case questionTypes.MULTIPLE_CHOICE:
              return <Radio disabled />

            case questionTypes.CATEGORY:
            case questionTypes.CHECKBOXES:
              return <Checkbox disabled />

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
      <Column>
        {(currentValue.isNew)
          ? <IconButton color="action" onClick={handleDelete}
            iconSize={20}>delete</IconButton>
          : (answerType === questionTypes.BINARY || isEdit)
            ? null
            : <IconButton color="action" onClick={handleDelete}
              iconSize={20}>delete</IconButton>
        }
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
  handleDelete: PropTypes.func,
  multiline: PropTypes.bool
}

SelectInput.defaultProps = {
  meta: {}
}

export default SelectInput