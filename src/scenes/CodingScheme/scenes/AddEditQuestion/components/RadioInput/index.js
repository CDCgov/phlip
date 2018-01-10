import React from 'react'
import PropTypes from 'prop-types'
import Radio from 'material-ui/Radio'
import Container, { Row, Column } from 'components/Layout'
import TextInput from 'components/TextInput'

const RadioInput = ({ answer }) => {
  return (
    <Container>
      <Column >
        <Radio disabled />
      </Column>
      <Column flex >
        <TextInput name='answer' placeholder='Add answer' type='text' />
      </Column>
    </Container>
  )
}


export default RadioInput