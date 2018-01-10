import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from 'material-ui/checkBox'
import Container, { Row, Column } from 'components/Layout'
import TextInput from 'components/TextInput'

const CheckboxInput = ({ answer }) => {
  return (
    <Container>
      <Column>
        <Checkbox disabled />
      </Column>
      <Column flex>
        <TextInput name='answer' placeholder='Add answer' type='text' />
      </Column>
    </Container>
  )
}

export default CheckboxInput