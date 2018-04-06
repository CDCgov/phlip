import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Radio from 'material-ui/Radio'
import Container, { Row, Column } from 'components/Layout'
import Checkbox from 'material-ui/Checkbox'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import IconButton from 'components/IconButton'
import * as questionTypes from '../../constants'
import { MenuDown } from 'mdi-material-ui'

const SelectInput = props => {
  const {
    name, label, answerType, type, input, classes, index, required,
    currentValue, meta: { asyncValidating, active, touched, error, warning, dirty },
    handleDelete, handleUp, handleDown, fields, isEdit, ...custom
  } = props

  return (
    <Container>
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
          <InputLabel htmlFor={name} shrink required={index === 0}>{label}</InputLabel>
          <Input
            id={name}
            {...input}
            type={type}
            {...custom}
          />
          {touched && error && !active && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
      </Column>
      <Row displayFlex style={{ alignItems: 'center' }}>
        {answerType !== questionTypes.BINARY &&
        <Column displayFlex>
          <IconButton
            color="action"
            iconSize={36}
            disableRipple={false}
            disabled={!index - 1 >= 0}
            aria-label="Move answer choice up one position"
            id={`move-answer-${index}-up`}
            onClick={handleUp}>arrow_drop_up</IconButton>
          <IconButton
            color="action"
            iconSize={36}
            style={{ marginTop: -16 }}
            disableRipple={false}
            disabled={index + 1 === fields.length}
            aria-label="Move answer choice down one position"
            id={`move-answer-${index}-down`}
            onClick={handleDown}>arrow_drop_down</IconButton>
        </Column>}
        <Column>
          {(currentValue.isNew)
            ? <IconButton
              color="action"
              onClick={handleDelete}
              iconSize={23}
              style={{ height: '20px !important' }}
              aria-label={`Delete ${index} answer`}
              id={`delete-answer-${index}`}>delete</IconButton>
            : (answerType === questionTypes.BINARY || isEdit)
              ? null
              : <IconButton
                color="action"
                onClick={handleDelete}
                iconSize={23}
                aria-label={`Delete ${index} answer`}
                id={`delete-answer-${index}`}>delete</IconButton>
          }
        </Column>
      </Row>
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