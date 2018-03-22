import React from 'react'
import PropTypes from 'prop-types'
import Radio from 'material-ui/Radio'
import Container, { Row, Column } from 'components/Layout'
import Checkbox from 'material-ui/Checkbox'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import IconButton from 'components/IconButton'
import * as questionTypes from '../../constants'
import { MenuDown } from 'mdi-material-ui'

const SelectInput = ({ name, label, answerType, type, input, classes, index, currentValue, meta: { asyncValidating, active, touched, error, warning, dirty }, handleDelete, handleUp, handleDown, fields, isEdit, ...custom }) => {
  return (
    <Container alignItems={'center'}>
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
              break
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
          ? <IconButton
            color="action"
            onClick={handleDelete}
            iconSize={20}
            aria-label={`Delete ${index} answer`}
            id={`delete-answer-${index}`}>delete</IconButton>
          : (answerType === questionTypes.BINARY || isEdit)
            ? null
            : <IconButton
              color="action"
              onClick={handleDelete}
              iconSize={20}
              aria-label={`Delete ${index} answer`}
              id={`delete-answer-${index}`}>delete</IconButton>
        }
      </Column>
      {answerType !== questionTypes.BINARY && <Column>
        <Row>
          <IconButton
            color="action"
            iconSize={36}
            disableRipple={false}
            disabled={!index - 1 >= 0}
            aria-label="Move answer choice up one position"
            id={`move-answer-${index}-up`}
            onClick={handleUp}>arrow_drop_up</IconButton>
        </Row>
        <Row style={{ marginTop: -20 }}>
          <IconButton
            color="action"
            iconSize={36}
            disableRipple={false}
            disabled={index + 1 === fields.length}
            aria-label="Move answer choice down one position"
            id={`move-answer-${index}-down`}
            onClick={handleDown}>arrow_drop_down</IconButton>
        </Row>
      </Column>}
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